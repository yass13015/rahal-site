/**
 * Demande d'inscription en plusieurs étapes (amélioration progressive de RegistrationForm.astro).
 * - une étape à la fois, validation en place, Entrée = étape suivante, récapitulatif avant envoi ;
 * - envoi JSON à FormSubmit ; la confirmation n'est affichée que si FormSubmit confirme la réception ;
 * - en cas d'échec, les réponses restent sur la page et des solutions de repli sont proposées.
 * Aucune réponse n'est conservée dans le navigateur (pas de localStorage / sessionStorage) : certaines concernent la santé.
 */

type FieldType = 'text' | 'email' | 'tel' | 'date' | 'choice' | 'textarea' | 'consent';
type Control = HTMLInputElement | HTMLTextAreaElement;

interface FieldRef {
  key: string;
  name: string;
  type: FieldType;
  required: boolean;
  el: HTMLElement;
  controls: Control[];
  error: HTMLElement | null;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const WHATSAPP_RE = /^\+?[0-9 .()-]{6,20}$/;
const NBSP = ' ';
const TIMEOUT_MS = 60000;

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const pad = (n: number) => String(n).padStart(2, '0');

function todayUtc(): number {
  const now = new Date();
  return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
}

function todayIso(): string {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** Lit une date : AAAA-MM-JJ (sélecteur natif) ou JJ/MM/AAAA (navigateurs sans sélecteur de date). */
function parseDate(value: string): Date | null {
  const v = value.trim();
  const iso = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const fr = v.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
  const parts = iso ? [+iso[1], +iso[2], +iso[3]] : fr ? [+fr[3], +fr[2], +fr[1]] : null;
  if (!parts) return null;
  const [y, m, d] = parts;
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) return null;
  return date;
}

/** 12/04/1995 (email reçu) */
function formatDateShort(value: string): string {
  const date = parseDate(value);
  if (!date) return value;
  return `${pad(date.getUTCDate())}/${pad(date.getUTCMonth() + 1)}/${date.getUTCFullYear()}`;
}

/** 12 avril 1995 (récapitulatif) */
function formatDateLong(value: string): string {
  const date = parseDate(value);
  if (!date) return value;
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
}

function valueOf(field: FieldRef): string {
  if (field.type === 'choice') {
    return (field.controls as HTMLInputElement[]).find((c) => c.checked)?.value ?? '';
  }
  if (field.type === 'consent') {
    const box = field.controls[0] as HTMLInputElement | undefined;
    return box?.checked ? box.value || 'Oui' : '';
  }
  return field.controls[0]?.value.trim() ?? '';
}

/** Message d'erreur du champ, ou null s'il est valide. */
function check(field: FieldRef): string | null {
  const control = field.controls[0];
  if (field.type === 'date' && control instanceof HTMLInputElement && control.validity.badInput) {
    return 'Indique une date complète et valide (jour, mois, année).';
  }
  const value = valueOf(field);
  if (!value) {
    if (!field.required) return null;
    switch (field.type) {
      case 'choice':
        return 'Choisis une réponse.';
      case 'consent':
        return 'Coche cette case pour pouvoir envoyer ta demande.';
      case 'email':
        return 'Indique ton adresse email.';
      case 'tel':
        return 'Indique ton numéro, avec l’indicatif.';
      case 'date':
        return 'Indique une date.';
      default:
        return 'Ce champ est obligatoire.';
    }
  }
  if (field.type === 'email' && !EMAIL_RE.test(value)) {
    return `Cette adresse email ne semble pas valide (ex.${NBSP}ton@email.com).`;
  }
  // Format souple (espaces, points, tirets), mais entre 8 et 15 chiffres comme un vrai numéro international.
  const digits = value.replace(/\D/g, '').length;
  if (field.type === 'tel' && (!WHATSAPP_RE.test(value) || digits < 8 || digits > 15)) {
    const example = control?.getAttribute('placeholder');
    return `Indique un numéro valide, avec l’indicatif${example ? ` (ex.${NBSP}${example})` : ''}.`;
  }
  if (field.type === 'date') {
    const date = parseDate(value);
    if (!date || date.getUTCFullYear() < 1900) return 'Indique une date valide (jour, mois, année).';
    if (date.getTime() >= todayUtc()) return 'Cette date doit être dans le passé.';
  }
  return null;
}

function setError(field: FieldRef, message: string | null) {
  if (field.error) field.error.textContent = message ?? '';
  field.el.toggleAttribute('data-invalid', Boolean(message));
  for (const control of field.controls) {
    if (message) control.setAttribute('aria-invalid', 'true');
    else control.removeAttribute('aria-invalid');
  }
}

export function initRegistrationForm() {
  const root = document.querySelector<HTMLElement>('[data-reg-root]');
  const form = root?.querySelector<HTMLFormElement>('form');
  if (!root || !form || root.hasAttribute('data-enhanced')) return;

  const steps = Array.from(form.querySelectorAll<HTMLFieldSetElement>('[data-step]'));
  if (steps.length === 0) return;
  const lastIndex = steps.length - 1;

  // --- Champs ---------------------------------------------------------------
  const byElement = new Map<Element, FieldRef>();
  const byKey = new Map<string, FieldRef>();
  const fieldsByStep: FieldRef[][] = steps.map((step) =>
    Array.from(step.querySelectorAll<HTMLElement>('[data-field]')).map((el) => {
      const field: FieldRef = {
        key: el.dataset.field ?? '',
        name: el.dataset.name ?? '',
        type: (el.dataset.type ?? 'text') as FieldType,
        required: el.hasAttribute('data-required'),
        el,
        controls: Array.from(el.querySelectorAll<Control>('input, textarea')),
        error: el.querySelector<HTMLElement>('[data-error]'),
      };
      byElement.set(el, field);
      byKey.set(field.key, field);
      return field;
    }),
  );
  const allFields = fieldsByStep.flat();
  const fieldFor = (target: EventTarget | null) => {
    const el = target instanceof Element ? target.closest('[data-field]') : null;
    return el ? byElement.get(el) : undefined;
  };
  const valueByAutocomplete = (token: string) => {
    const field = allFields.find((f) => f.controls[0]?.getAttribute('autocomplete') === token);
    return field ? valueOf(field) : '';
  };

  // --- Éléments d'interface -------------------------------------------------
  const q = <T extends Element = HTMLElement>(selector: string) => root.querySelector<T>(selector);
  const count = q('[data-count]');
  const bar = q('[data-bar]');
  const stepperButtons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-stepper] [data-goto]'));
  const prev = q<HTMLButtonElement>('[data-prev]');
  const next = q<HTMLButtonElement>('[data-next]');
  const submit = q<HTMLButtonElement>('[data-submit]');
  const submitLabel = q('[data-submit-label]');
  const idleLabel = submitLabel?.textContent ?? '';
  const privacy = q('[data-privacy]');
  const recap = q('[data-recap-panel]');
  const recapCells = Array.from(root.querySelectorAll<HTMLElement>('[data-recap]'));
  const errorPanel = q('[data-error-panel]');
  const errorMessage = q('[data-error-message]');
  const retry = q<HTMLButtonElement>('[data-retry]');
  const success = q('[data-success]');
  const successName = q('[data-success-name]');
  const successTitle = q('[data-success-title]');
  const live = q('[data-announce]');
  const endpoint = form.dataset.endpoint || form.action;
  const subject = form.dataset.subject ?? '';

  let current = 0;
  let maxReached = 0;
  let sending = false;

  const stepTitle = (i: number) => steps[i]?.querySelector<HTMLElement>('[data-step-title]')?.textContent?.replace(/\s+/g, ' ').trim() ?? '';

  function announce(message: string) {
    if (!live) return;
    live.textContent = '';
    window.setTimeout(() => {
      live.textContent = message;
    }, 80);
  }

  function scrollToCard() {
    const scrollPadding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const top = root!.getBoundingClientRect().top;
    if (top < scrollPadding || top > window.innerHeight * 0.55) {
      root!.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    }
  }

  function fillRecap() {
    for (const cell of recapCells) {
      const field = byKey.get(cell.dataset.recap ?? '');
      if (!field) continue;
      const value = valueOf(field);
      cell.textContent = value ? (field.type === 'date' ? formatDateLong(value) : value) : 'Non renseigné';
      cell.classList.toggle('is-empty', !value);
    }
  }

  function render() {
    const isLast = current === lastIndex;
    steps.forEach((step, i) => {
      step.hidden = i !== current;
    });
    if (prev) prev.hidden = current === 0;
    if (next) next.hidden = isLast;
    if (submit) submit.hidden = !isLast;
    if (privacy) privacy.hidden = !isLast;
    if (recap) recap.hidden = !isLast;
    if (!isLast) hideError();
    if (count) count.textContent = `Étape ${current + 1} sur ${steps.length}`;
    bar?.style.setProperty('--progress', String((current + 1) / steps.length));

    stepperButtons.forEach((button, i) => {
      const isCurrent = i === current;
      const done = i < maxReached && !isCurrent;
      button.disabled = i > maxReached;
      if (isCurrent) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
      const item = button.closest('li');
      item?.classList.toggle('is-current', isCurrent);
      item?.classList.toggle('is-done', done);
      const state = button.querySelector('[data-step-state]');
      if (state) state.textContent = isCurrent ? ' (étape en cours)' : done ? ' (terminée)' : ' (à venir)';
    });

    if (isLast) fillRecap();
  }

  /** Valide une étape, affiche les erreurs et renvoie les champs invalides. */
  function validateStep(index: number): FieldRef[] {
    const invalid: FieldRef[] = [];
    for (const field of fieldsByStep[index] ?? []) {
      const message = check(field);
      setError(field, message);
      if (message) invalid.push(field);
    }
    return invalid;
  }

  function focusInvalid(invalid: FieldRef[]) {
    const first = invalid[0];
    if (!first) return;
    const target =
      first.type === 'choice' ? ((first.controls as HTMLInputElement[]).find((c) => c.checked) ?? first.controls[0]) : first.controls[0];
    target?.focus();
    announce(
      invalid.length === 1
        ? 'Un champ est à compléter ou à corriger.'
        : `${invalid.length} champs sont à compléter ou à corriger.`,
    );
  }

  /** Affiche l'étape demandée ; en avançant, chaque étape intermédiaire doit être valide. */
  function goTo(target: number) {
    if (target === current || target < 0 || target > lastIndex || sending) return;
    if (target > current) {
      for (let i = current; i < target; i++) {
        const invalid = validateStep(i);
        if (invalid.length > 0) {
          if (i !== current) {
            current = i;
            render();
          }
          focusInvalid(invalid);
          return;
        }
        maxReached = Math.max(maxReached, i + 1);
      }
    }
    current = target;
    render();
    scrollToCard();
    steps[current]?.querySelector<HTMLElement>('[data-step-title]')?.focus({ preventScroll: true });
    announce(`Étape ${current + 1} sur ${steps.length}${NBSP}: ${stepTitle(current)}`);
  }

  function hideError() {
    if (errorPanel) errorPanel.hidden = true;
    if (errorMessage) errorMessage.textContent = '';
  }

  function showError() {
    if (!errorPanel) return;
    errorPanel.hidden = false;
    if (errorMessage) errorMessage.textContent = '';
    // Le message est inséré après l'affichage du panneau pour être annoncé par les lecteurs d'écran.
    window.requestAnimationFrame(() => {
      if (errorMessage) errorMessage.textContent = 'Ta demande n’a pas pu être envoyée. Tes réponses sont bien conservées sur cette page.';
    });
    errorPanel.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
    // Le bouton utilisé a été désactivé pendant l'envoi : le focus, perdu, est rendu sur « Réessayer ».
    const active = document.activeElement;
    if (!active || active === document.body || active === submit || active === retry) {
      retry?.focus({ preventScroll: true });
    }
  }

  function setSending(on: boolean) {
    sending = on;
    form!.setAttribute('aria-busy', String(on));
    if (submit) {
      submit.disabled = on;
      submit.setAttribute('aria-busy', String(on));
    }
    if (submitLabel) submitLabel.textContent = on ? 'Envoi en cours…' : idleLabel;
    if (prev) prev.disabled = on;
    if (retry) retry.disabled = on;
    stepperButtons.forEach((button, i) => {
      button.disabled = on || i > maxReached;
    });
  }

  function buildPayload(): Record<string, string> {
    const payload: Record<string, string> = {};
    const first = valueByAutocomplete('given-name');
    const last = valueByAutocomplete('family-name');
    const who = [first, last].filter(Boolean).join(' ');
    payload._subject = who ? `${subject} · ${who}` : subject;
    payload._template = form!.querySelector<HTMLInputElement>('input[name="_template"]')?.value || 'table';
    payload._honey = form!.querySelector<HTMLInputElement>('input[name="_honey"]')?.value ?? '';
    for (const field of allFields) {
      const value = valueOf(field);
      payload[field.name] = field.type === 'date' ? formatDateShort(value) : value;
    }
    return payload;
  }

  function showSuccess() {
    const first = valueByAutocomplete('given-name');
    if (successName) successName.textContent = first ? `Merci, ${first}` : 'Merci';
    form!.reset();
    form!.hidden = true;
    if (success) success.hidden = false;
    root!.classList.add('is-sent');
    scrollToCard();
    successTitle?.focus({ preventScroll: true });
  }

  async function send() {
    if (sending) return;
    hideError();

    // Toutes les étapes sont revérifiées : une réponse a pu être effacée en revenant en arrière.
    for (let i = 0; i <= lastIndex; i++) {
      const invalid = validateStep(i);
      if (invalid.length > 0) {
        if (i !== current) {
          current = i;
          render();
        }
        focusInvalid(invalid);
        return;
      }
    }

    const payload = buildPayload();
    setSending(true);
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
    let sent = false;
    try {
      const formData = new FormData();

      for (const [name, value] of Object.entries(payload)) {
        if (name === '_template') continue;

        const fieldName =
          name === '_subject' ? 'subject' :
          name === '_honey' ? '_gotcha' : name;

        formData.append(fieldName, value);
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
        signal: controller.signal,
      });

      sent = response.ok;

      if (!sent) {
        console.warn(
          '[inscription] Formspree - erreur HTTP :',
          response.status
        );
      }
    } catch (error) {
      console.warn('[inscription] Envoi impossible :', error);
    } finally {
      window.clearTimeout(timer);
      setSending(false);
    }
    if (sent) showSuccess();
    else showError();
  }

  // --- Mise en place --------------------------------------------------------
  form.noValidate = true;
  for (const field of allFields) {
    if (field.type !== 'date') continue;
    const input = field.controls[0];
    if (!(input instanceof HTMLInputElement)) continue;
    if (input.type === 'date') {
      input.max = todayIso();
    } else {
      // Navigateur sans sélecteur de date : saisie libre guidée.
      input.placeholder = 'jj/mm/aaaa';
      input.inputMode = 'numeric';
    }
  }

  // Efface l'erreur d'un champ dès qu'il devient valide.
  const revalidate = (event: Event) => {
    const field = fieldFor(event.target);
    if (field?.el.hasAttribute('data-invalid')) setError(field, check(field));
  };
  form.addEventListener('input', revalidate);
  form.addEventListener('change', revalidate);

  // Format vérifié en quittant le champ (email, numéro, date), sans signaler un champ resté vide.
  form.addEventListener('focusout', (event) => {
    const field = fieldFor(event.target);
    if (!field || !['email', 'tel', 'date'].includes(field.type)) return;
    const control = field.controls[0];
    const badInput = control instanceof HTMLInputElement && control.validity.badInput;
    if (!valueOf(field) && !badInput) return;
    setError(field, check(field));
  });

  // Entrée dans un champ : étape suivante (sauf à la dernière étape, où Entrée envoie).
  form.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' || event.isComposing || current === lastIndex) return;
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || ['button', 'submit', 'reset', 'file', 'image'].includes(target.type)) return;
    event.preventDefault();
    goTo(current + 1);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (current < lastIndex) goTo(current + 1);
    else void send();
  });

  next?.addEventListener('click', () => goTo(current + 1));
  prev?.addEventListener('click', () => goTo(current - 1));
  retry?.addEventListener('click', () => void send());
  root.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest<HTMLButtonElement>('[data-goto]') : null;
    if (!button || button.disabled) return;
    goTo(Number(button.dataset.goto));
  });

  root.setAttribute('data-enhanced', '');
  render();
}
