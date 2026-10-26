/**
 * Lecture et validation des formulaires, côté serveur.
 * Les messages sont en français car ils peuvent être renvoyés au visiteur.
 */

export type FormValues = Record<string, string>;

/** Lit un corps JSON, `application/x-www-form-urlencoded` ou `multipart/form-data`. */
export async function readBody(request: Request): Promise<FormValues> {
  const type = request.headers.get('content-type') ?? '';
  const values: FormValues = {};
  if (type.includes('application/json')) {
    const json = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    for (const [k, v] of Object.entries(json)) {
      values[k] = v == null ? '' : String(v);
    }
    return values;
  }
  const form = await request.formData().catch(() => null);
  if (form) {
    for (const [k, v] of form.entries()) {
      values[k] = typeof v === 'string' ? v : '';
    }
  }
  return values;
}

/** Vrai si la requête vient d'un envoi de formulaire classique (sans JavaScript). */
export function wantsHtml(request: Request): boolean {
  const accept = request.headers.get('accept') ?? '';
  return accept.includes('text/html') && !accept.includes('application/json');
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const WHATSAPP_RE = /^\+?[0-9 .()-]{6,20}$/;

export const clean = (v: string | undefined, max = 200) => (v ?? '').toString().trim().slice(0, max);

export function isEmail(v: string): boolean {
  return EMAIL_RE.test(v) && v.length <= 254;
}

export interface ProgrammeInput {
  prenom: string;
  email: string;
  whatsapp: string;
  consentement: boolean;
  experience: string;
}

export function validateProgramme(values: FormValues): { ok: true; data: ProgrammeInput } | { ok: false; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const prenom = clean(values.prenom, 80);
  const email = clean(values.email, 254).toLowerCase();
  const whatsapp = clean(values.whatsapp, 30);
  const consentement = ['on', 'true', '1', 'oui'].includes(clean(values.consentement, 10).toLowerCase());
  const experience = clean(values.experience, 60);

  if (prenom.length < 2) errors.prenom = 'Indique ton prénom.';
  if (!isEmail(email)) errors.email = 'Indique une adresse email valide.';
  if (whatsapp && !WHATSAPP_RE.test(whatsapp)) errors.whatsapp = 'Indique un numéro valide (avec l’indicatif, ex. +33 6 12 34 56 78).';
  if (consentement && !whatsapp) errors.whatsapp = 'Indique ton numéro WhatsApp pour recevoir les infos par ce canal.';
  if (!experience) errors.experience = 'Expérience inconnue.';

  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, data: { prenom, email, whatsapp, consentement, experience } };
}

export interface ContactInput {
  prenom: string;
  email: string;
  sujet: string;
  message: string;
}

export function validateContact(values: FormValues): { ok: true; data: ContactInput } | { ok: false; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const prenom = clean(values.prenom, 80);
  const email = clean(values.email, 254).toLowerCase();
  const sujet = clean(values.sujet, 120);
  const message = clean(values.message, 5000);

  if (prenom.length < 2) errors.prenom = 'Indique ton prénom.';
  if (!isEmail(email)) errors.email = 'Indique une adresse email valide.';
  if (!sujet) errors.sujet = 'Choisis un sujet.';
  if (message.length < 10) errors.message = 'Écris un message d’au moins quelques mots.';

  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, data: { prenom, email, sujet, message } };
}

/** Échappe le HTML pour insérer des valeurs saisies dans un email. */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
