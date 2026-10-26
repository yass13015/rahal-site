/**
 * Client Brevo minimal, utilisé uniquement côté serveur (routes /api/*).
 * La clé API est lue depuis les variables d'environnement serveur : elle n'est jamais exposée au navigateur.
 */
import {
  BREVO_API_KEY,
  BREVO_API_URL,
  BREVO_SENDER_EMAIL,
  BREVO_SENDER_NAME,
  CONTACT_TO_EMAIL,
} from 'astro:env/server';

export class BrevoError extends Error {
  constructor(
    public status: number,
    public body: string,
  ) {
    super(`Brevo ${status}: ${body.slice(0, 300)}`);
  }
}

export const brevo = {
  /** Vrai si une clé API est configurée. */
  isConfigured: () => Boolean(BREVO_API_KEY),
  /** Vrai si un expéditeur est configuré (nécessaire pour envoyer des emails sans template). */
  hasSender: () => Boolean(BREVO_SENDER_EMAIL),
  /** Adresse qui reçoit les messages du formulaire de contact. */
  contactInbox: () => CONTACT_TO_EMAIL || '',
  sender: () => ({ email: BREVO_SENDER_EMAIL as string, name: BREVO_SENDER_NAME || 'RAHAL' }),
};

async function post(path: string, body: unknown): Promise<unknown> {
  if (!BREVO_API_KEY) throw new BrevoError(0, 'BREVO_API_KEY manquante');
  const base = (BREVO_API_URL || 'https://api.brevo.com/v3').replace(/\/$/, '');
  const res = await fetch(`${base}${path}`, {
    method: 'POST',
    headers: {
      'api-key': BREVO_API_KEY,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new BrevoError(res.status, text);
  }
  if (res.status === 204) return null;
  return res.json().catch(() => null);
}

export interface UpsertContactInput {
  email: string;
  attributes: Record<string, string | boolean | number>;
  listIds?: number[];
}

/** Crée ou met à jour un contact (`POST /contacts` avec `updateEnabled`). */
export async function upsertContact(input: UpsertContactInput): Promise<void> {
  await post('/contacts', {
    email: input.email,
    attributes: input.attributes,
    listIds: input.listIds && input.listIds.length ? input.listIds : undefined,
    updateEnabled: true,
  });
}

export interface TemplateEmailInput {
  to: { email: string; name?: string };
  templateId: number;
  params?: Record<string, string | number | boolean>;
}

/** Envoie un email transactionnel basé sur un template Brevo. */
export async function sendTemplateEmail(input: TemplateEmailInput): Promise<void> {
  await post('/smtp/email', {
    to: [input.to],
    templateId: input.templateId,
    params: input.params,
  });
}

export interface EmailInput {
  to: { email: string; name?: string };
  subject: string;
  html: string;
  text: string;
  replyTo?: { email: string; name?: string };
}

/** Envoie un email transactionnel simple depuis l'expéditeur configuré. */
export async function sendEmail(input: EmailInput): Promise<void> {
  if (!brevo.hasSender()) throw new BrevoError(0, 'BREVO_SENDER_EMAIL manquante');
  await post('/smtp/email', {
    sender: brevo.sender(),
    to: [input.to],
    replyTo: input.replyTo,
    subject: input.subject,
    htmlContent: input.html,
    textContent: input.text,
  });
}
