import type { Experience } from '../types';
import { chine } from './chine';

/**
 * Catalogue des expériences.
 * Pour ajouter une expérience : créer un fichier dans ce dossier (copier `chine.ts`),
 * l'importer ici et l'ajouter au tableau. Seules les expériences `published: true` sont affichées.
 */
const all: Experience[] = [chine];

export const experiences: Experience[] = all.filter((e) => e.published);

export function getExperience(slug: string): Experience | undefined {
  return experiences.find((e) => e.slug === slug);
}

/** Expérience mise en avant sur la page d'accueil (la première publiée). */
export const featuredExperience: Experience | undefined = experiences[0];
