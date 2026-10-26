/**
 * Demande de programme : enregistre le contact dans Brevo (avec l'expérience concernée)
 * et envoie le programme par email. Rendu à la demande (jamais pré-rendu).
 */
export const prerender = false;

import type { APIRoute } from 'astro';
import { getExperience } from '@/content/experiences';
import { brevo, sendEmail, sendTemplateEmail, upsertContact } from '@/lib/brevo';
import { escapeHtml, readBody, validateProgramme, wantsHtml } from '@/lib/validation';

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

const MESSAGES = {
  indisponible: 'L’envoi n’est pas encore disponible. Réessaie plus tard ou écris-nous directement depuis la page contact.',
  echec: 'L’envoi a échoué. Réessaie dans quelques minutes ou écris-nous directement depuis la page contact.',
  champs: 'Vérifie les champs indiqués.',
};

export const POST: APIRoute = async ({ request, redirect, site }) => {
  const values = await readBody(request);
  const html = wantsHtml(request);
  const experience = getExperience((values.experience ?? '').trim());
  const back = (state: 'ok' | 'erreur' | 'indisponible') =>
    redirect(`/experiences/${experience?.slug ?? ''}?programme=${state}#demande`, 303);

  // Pot de miel : un robot a rempli le champ caché. On ne fait rien, sans le signaler.
  if (values.website) return html ? back('ok') : json(200, { ok: true });

  if (!experience) {
    return html ? redirect('/experiences', 303) : json(404, { ok: false, message: 'Expérience inconnue.' });
  }

  const result = validateProgramme(values);
  if (!result.ok) {
    return html ? back('erreur') : json(400, { ok: false, message: MESSAGES.champs, errors: result.errors });
  }

  if (!brevo.isConfigured()) {
    console.warn('[programme] BREVO_API_KEY absente : demande refusée (aucun envoi simulé).');
    return html ? back('indisponible') : json(503, { ok: false, message: MESSAGES.indisponible });
  }

  const { prenom, email, whatsapp, consentement } = result.data;
  const programmeUrl = experience.programmeUrl ? new URL(experience.programmeUrl, site).toString() : undefined;
  const experienceLabel = `${experience.name} — ${experience.country}`;

  try {
    await upsertContact({
      email,
      attributes: {
        PRENOM: prenom,
        WHATSAPP: whatsapp,
        EXPERIENCE: experience.slug,
        EXPERIENCE_NOM: experienceLabel,
        CONSENTEMENT_WHATSAPP: consentement,
        SOURCE: 'site',
      },
      listIds: experience.brevo?.listId ? [experience.brevo.listId] : undefined,
    });

    if (experience.brevo?.templateId) {
      await sendTemplateEmail({
        to: { email, name: prenom },
        templateId: experience.brevo.templateId,
        params: {
          PRENOM: prenom,
          EXPERIENCE: experience.name,
          PAYS: experience.country,
          PROGRAMME_URL: programmeUrl ?? '',
        },
      });
    } else if (brevo.hasSender()) {
      const intro = `Bonjour ${escapeHtml(prenom)},`;
      const body = programmeUrl
        ? `Merci pour ta demande. Voici le programme de <strong>${escapeHtml(experienceLabel)}</strong> : <a href="${programmeUrl}">${programmeUrl}</a>`
        : `Merci pour ta demande concernant <strong>${escapeHtml(experienceLabel)}</strong>. Le programme détaillé est en cours de finalisation : tu le recevras dès qu’il est disponible.`;
      const textBody = programmeUrl
        ? `Merci pour ta demande. Voici le programme de ${experienceLabel} : ${programmeUrl}`
        : `Merci pour ta demande concernant ${experienceLabel}. Le programme détaillé est en cours de finalisation : tu le recevras dès qu’il est disponible.`;
      await sendEmail({
        to: { email, name: prenom },
        subject: programmeUrl ? `Ton programme ${experienceLabel}` : `Ta demande de programme : ${experienceLabel}`,
        html: `<p>${intro}</p><p>${body}</p><p>Demander le programme ne constitue pas une réservation. Si tu as la moindre question, réponds simplement à cet email.</p><p>À bientôt,<br>Yassine — RAHAL</p>`,
        text: `Bonjour ${prenom},\n\n${textBody}\n\nDemander le programme ne constitue pas une réservation. Si tu as la moindre question, réponds simplement à cet email.\n\nÀ bientôt,\nYassine — RAHAL`,
      });
    }

    return html ? back('ok') : json(200, { ok: true, programmeUrl: experience.programmeUrl ?? null });
  } catch (error) {
    console.error('[programme] échec Brevo', error);
    return html ? back('erreur') : json(502, { ok: false, message: MESSAGES.echec });
  }
};

export const GET: APIRoute = () => json(405, { ok: false, message: 'Méthode non autorisée.' });
