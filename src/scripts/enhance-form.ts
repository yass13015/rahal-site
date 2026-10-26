
/**
 * Gestion des formulaires RAHAL :
 * validation, envoi Formspree, chargement, erreurs et succès.
 */

type Rule = (value: string, form: HTMLFormElement) => string | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const WHATSAPP_RE = /^\+?[0-9 .()-]{6,20}$/;

const rules: Record<string, Rule> = {
  prenom: (v) =>
    v.trim().length < 2 ? 'Indique ton prénom.' : null,

  email: (v) =>
    EMAIL_RE.test(v.trim()) ? null : 'Indique une adresse email valide.',

  whatsapp: (v, form) => {
    const value = v.trim();
    const consent = form.querySelector<HTMLInputElement>(
      'input[name="consentement"]'
    )?.checked;

    if (value && !WHATSAPP_RE.test(value)) {
      return 'Indique un numéro valide avec l’indicatif.';
    }
    if (consent && !value) {
      return 'Indique ton numéro WhatsApp.';
    }
    return null;
  },

  sujet: (v) =>
    v.trim() ? null : 'Choisis un sujet.',

  message: (v) =>
    v.trim().length < 10
      ? 'Écris un message d’au moins quelques mots.'
      : null,
};

function setFieldError(
  form: HTMLFormElement,
  name: string,
  message: string | null
) {
  const input = form.querySelector<HTMLInputElement>(
    `[name="${name}"]`
  );
  const error = form.querySelector<HTMLElement>(
    `[data-error-for="${name}"]`
  );

  if (error) error.textContent = message ?? '';

  if (input) {
    if (message) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  }
}

function validate(form: HTMLFormElement): boolean {
  let firstInvalid: HTMLElement | null = null;

  for (const [name, rule] of Object.entries(rules)) {
    const input = form.querySelector<HTMLInputElement>(
      `[name="${name}"]`
    );
    if (!input) continue;

    const message = rule(input.value, form);
    setFieldError(form, name, message);

    if (message && !firstInvalid) {
      firstInvalid = input;
    }
  }

  firstInvalid?.focus();
  return !firstInvalid;
}

function showStatus(
  el: HTMLElement | null,
  message: string,
  kind: 'error' | 'info'
) {
  if (!el) return;
  el.textContent = message;
  el.className = `form-status form-status--${kind}`;
}

function showSuccess(
  root: HTMLElement,
  form: HTMLFormElement,
  data: { prenom?: string; programmeUrl?: string | null }
) {
  const success = root.querySelector<HTMLElement>('[data-success]');
  if (!success) return;

  const name = success.querySelector<HTMLElement>(
    '[data-success-name]'
  );

  if (name) {
    name.textContent = data.prenom
      ? `Merci, ${data.prenom}. `
      : 'Merci. ';
  }

  const link = success.querySelector<HTMLAnchorElement>(
    '[data-success-link]'
  );

  if (link) {
    if (data.programmeUrl) {
      link.href = data.programmeUrl;
      link.hidden = false;
    } else {
      link.hidden = true;
    }
  }

  form.hidden = true;
  success.hidden = false;
  success.querySelector<HTMLElement>('h2, h3')?.focus();
}

export function enhanceForm(name: string) {
  const root = document.querySelector<HTMLElement>(
    `[data-form-root="${name}"]`
  );
  const form = root?.querySelector<HTMLFormElement>('form');

  if (!root || !form) return;

  form.noValidate = true;

  const status = root.querySelector<HTMLElement>('[data-status]');
  const submit = form.querySelector<HTMLButtonElement>(
    '[data-submit]'
  );
  const submitLabel = form.querySelector<HTMLElement>(
    '[data-submit-label]'
  );
  const idleLabel = submitLabel?.textContent ?? '';

  const setLoading = (loading: boolean) => {
    if (submit) {
      submit.disabled = loading;
      submit.setAttribute('aria-busy', String(loading));
    }

    if (submitLabel) {
      submitLabel.textContent = loading
        ? 'Envoi en cours…'
        : idleLabel;
    }
  };

  const params = new URLSearchParams(window.location.search);
  const state = params.get(name);

  if (state === 'ok') {
    const link = root.querySelector<HTMLAnchorElement>(
      '[data-success-link]'
    );
    showSuccess(root, form, {
      programmeUrl: link?.getAttribute('href') || null,
    });
  } else if (state === 'erreur') {
    showStatus(status, 'L’envoi a échoué. Réessaie.', 'error');
  } else if (state === 'indisponible') {
    showStatus(status, 'L’envoi est indisponible.', 'error');
  }

  form.addEventListener('input', (event) => {
    const target = event.target as HTMLInputElement;

    if (target?.name && rules[target.name]) {
      setFieldError(form, target.name, null);
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    showStatus(status, '', 'info');
    if (status) status.className = 'form-status';

    if (!validate(form)) return;

    setLoading(true);

    const formData = new FormData(form);
    const prenomValue = formData.get('prenom');
    const prenom =
      typeof prenomValue === 'string' ? prenomValue : '';

    const controller = new AbortController();
    const timer = window.setTimeout(
      () => controller.abort(),
      20000
    );

    try {
      const response = await fetch(
        form.dataset.endpoint || form.action,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
          },
          body: formData,
          signal: controller.signal,
        }
      );

      if (response.ok) {
        showSuccess(root, form, { prenom });
        return;
      }

      const data = (await response.json().catch(() => ({}))) as {
        message?: string;
        errors?: Array<{
          field?: string;
          message?: string;
        }>;
      };

      if (Array.isArray(data.errors)) {
        for (const error of data.errors) {
          if (error.field && error.message) {
            setFieldError(form, error.field, error.message);
          }
        }
      }

      console.warn(
        '[RAHAL Formspree] Envoi refusé :',
        response.status,
        data
      );

      showStatus(
        status,
        data.message ||
          form.dataset.errorMessage ||
          'L’envoi a échoué. Réessaie.',
        'error'
      );
    } catch (error) {
      console.warn('[RAHAL Formspree] Erreur :', error);

      showStatus(
        status,
        form.dataset.errorMessage ||
          'Impossible de joindre le serveur.',
        'error'
      );
    } finally {
      window.clearTimeout(timer);
      setLoading(false);
    }
  });
}
