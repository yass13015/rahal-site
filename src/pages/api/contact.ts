/**
 * Formulaire de contact : envoie le message par email (Brevo) à l'adresse configurée.
 * Rendu à la demande (jamais pré-rendu).
 */
export const prerender = false;

import type { APIRoute } from 'astro';
import { brevo, sendEmail } from '@/lib/brevo';
import { escapeHtml, readBody, validateContact, wantsHtml } from '@/lib/validation';

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

const MESSAGES = {
  indisponible: 'L’envoi de messages n’est pas encore disponible. Réessaie plus tard.',
  echec: 'L’envoi a échoué. Réessaie dans quelques minutes.',
  champs: 'Vérifie les champs indiqués.',
};

export const POST: APIRoute = async ({ request, redirect }) => {
  const values = await readBody(request);
  const html = wantsHtml(request);
  const back = (state: 'ok' | 'erreur' | 'indisponible') => redirect(`/faq-contact?contact=${state}#contact`, 303);

  if (values.website) return html ? back('ok') : json(200, { ok: true });

  const result = validateContact(values);
  if (!result.ok) {
    return html ? back('erreur') : json(400, { ok: false, message: MESSAGES.champs, errors: result.errors });
  }

  if (!brevo.isConfigured() || !brevo.hasSender() || !brevo.contactInbox()) {
    console.warn('[contact] Brevo incomplet (clé, expéditeur ou adresse de réception manquante) : message refusé.');
    return html ? back('indisponible') : json(503, { ok: false, message: MESSAGES.indisponible });
  }

  const { prenom, email, sujet, message } = result.data;

  try {
    await sendEmail({
      to: { email: brevo.contactInbox() },
      replyTo: { email, name: prenom },
      subject: `[Site RAHAL] ${sujet} — ${prenom}`,
      html: `<p><strong>Prénom :</strong> ${escapeHtml(prenom)}<br><strong>Email :</strong> ${escapeHtml(email)}<br><strong>Sujet :</strong> ${escapeHtml(sujet)}</p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
      text: `Prénom : ${prenom}\nEmail : ${email}\nSujet : ${sujet}\n\n${message}`,
    });
    return html ? back('ok') : json(200, { ok: true });
  } catch (error) {
    console.error('[contact] échec Brevo', error);
    return html ? back('erreur') : json(502, { ok: false, message: MESSAGES.echec });
  }
};

export const GET: APIRoute = () => json(405, { ok: false, message: 'Méthode non autorisée.' });
