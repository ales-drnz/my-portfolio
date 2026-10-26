import { getCollection, getEntry, render, type CollectionEntry } from 'astro:content';
import type { Lang } from './i18n';

/** Case studies in order, with the Italian text laid over the English data when there is one. */
export async function getProjects(lang: Lang): Promise<CollectionEntry<'projects'>[]> {
  const projects = (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order);
  if (lang === 'en') return projects;
  const it = new Map((await getCollection('projectsIt')).map((e) => [e.id, e.data]));
  return projects.map((p) => {
    const t = it.get(p.id);
    if (!t) return p;
    const data = Object.fromEntries(Object.entries(t).filter(([, v]) => v !== undefined));
    return { ...p, data: { ...p.data, ...data } };
  });
}

/** the page body in the given language, falling back to English */
export async function renderProject(project: CollectionEntry<'projects'>, lang: Lang) {
  const source = (lang === 'it' && (await getEntry('projectsIt', project.id))) || project;
  return render(source);
}
