/* English lives at the root, Italian under /it/. Every page is built once per language. */

export const LANGS = ['en', 'it'] as const;
export type Lang = (typeof LANGS)[number];

export const langFromUrl = (url: URL): Lang => (/^\/it(\/|$)/.test(url.pathname) ? 'it' : 'en');

/** a root-relative path ('/', '/#work', '/projects/x') in the given language */
export const localePath = (lang: Lang, path: string) => (lang === 'en' ? path : `/it${path}`);

/** the same page in the other language */
export const switchPath = (url: URL, to: Lang) => {
  const base = url.pathname.replace(/^\/it(?=\/|$)/, '') || '/';
  return localePath(to, base);
};

const OPEN = '<span class="text-open whitespace-nowrap">open-source</span>';

export const UI = {
  en: {
    locale: 'en-GB',
    description:
      'Building open-source tools and apps. M.Sc. Telecommunications Engineering student at Sapienza University of Rome.',
    skip: 'Skip to content',
    nav: { work: 'Work', education: 'Education', openSource: 'Open source', contact: 'Contact' },
    themeToggle: 'Toggle color theme',
    switchLang: 'Leggi in italiano',
    footer: { built: 'Built with Astro', refreshed: 'Data refreshed', source: 'Source' },
    copyEmail: 'Copy email',
    copied: 'Copied!',

    // the highlighted word keeps the accent colour
    headline: `Building ${OPEN}<br /> tools and apps`,
    studies: 'Electronics and Telecommunication Engineering at Sapienza University of Rome',
    pubDownloads: 'pub.dev downloads',
    perMonth: '/30 days',
    weeklyAll: 'Weekly pub.dev downloads across all packages',
    stars: 'GitHub stars',
    likes: 'pub.dev likes',
    upstreamPRs: 'upstream PRs',
    issuesResolved: 'issues resolved',

    work: {
      eyebrow: 'Work',
      title: 'Projects',
      lead: 'Grouped by area. Case studies have their own page with details, demos and code.',
      groups: 'Project groups',
      count: (n: number) => `${n} ${n === 1 ? 'project' : 'projects'}`,
    },
    education: { eyebrow: 'Education', title: 'Studies & languages' },
    activity: { eyebrow: 'Activity', title: 'Last 12 months' },
    code: {
      title: 'Languages on my GitHub',
      other: 'Other',
      row: (name: string, pct: string) => `${name}: ${pct} of the code`,
      size: (size: string) => `${size} of code`,
      hint: 'Point at a slice for details',
    },
    upstream: {
      eyebrow: 'Upstream',
      title: 'Open source contributions',
      lead: 'Pull and merge requests merged into other projects, on GitHub and GitLab.',
      merged: (n: number) => `${n} merged`,
    },
    contact: { eyebrow: 'Contact', title: 'Get in touch', lead: 'Email is the quickest way to reach me.' },

    card: {
      stars: 'Stars',
      likes: 'Likes',
      lastPush: 'Last push',
      push: 'Push',
      platforms: 'Platforms',
      weekly: (name: string) => `Weekly downloads of ${name}, last 6 months`,
      noDescription: 'No description yet.',
    },
    kind: { library: 'library', app: 'app', tool: 'tool', system: 'system' },

    timeline: { present: 'present', inProgress: 'In progress', thesis: 'Thesis', supervisor: 'Supervisor' },
    languages: { title: 'Languages', native: 'Native', nativeSpeaker: 'native speaker', cefr: 'CEFR level' },
    graph: {
      contributions: 'contributions',
      activeDays: 'active days',
      busiest: 'on the busiest day',
      less: 'less',
      more: 'more',
      day: (n: number, date: string) => `${n} contribution${n === 1 ? '' : 's'} on ${date}`,
      year: (n: number) => `${n} contributions in the last year`,
      unavailable: 'Contribution data unavailable —',
      seeOnGitHub: 'see it on GitHub',
    },
    project: {
      allWork: 'All work',
      stars: 'GitHub stars',
      likes: 'pub.dev likes',
      points: 'pub points',
      downloads: 'Downloads /30d',
      weekly: 'Weekly downloads',
      type: 'Type',
      platforms: 'Platforms',
      latest: 'Latest',
      lastPush: 'Last push',
      stack: 'Stack',
      links: 'Links',
      next: 'Next project',
    },
    ago: { today: 'today', d: (n: number) => `${n}d ago`, mo: (n: number) => `${n}mo ago`, y: (n: number) => `${n}y ago` },
  },

  it: {
    locale: 'it-IT',
    description:
      'Creo strumenti e app open-source. Studente magistrale in Ingegneria delle Telecomunicazioni alla Sapienza Università di Roma.',
    skip: 'Vai al contenuto',
    nav: { work: 'Progetti', education: 'Formazione', openSource: 'Open source', contact: 'Contatti' },
    themeToggle: 'Cambia tema',
    switchLang: 'Read in English',
    footer: { built: 'Realizzato con Astro', refreshed: 'Dati aggiornati al', source: 'Sorgente' },
    copyEmail: 'Copia email',
    copied: 'Copiata!',

    headline: `Creo strumenti<br /> e app ${OPEN}`,
    studies: 'Ingegneria Elettronica e delle Telecomunicazioni alla Sapienza Università di Roma',
    pubDownloads: 'download su pub.dev',
    perMonth: '/30 giorni',
    weeklyAll: 'Download settimanali su pub.dev di tutti i pacchetti',
    stars: 'stelle GitHub',
    likes: 'like su pub.dev',
    upstreamPRs: 'PR upstream',
    issuesResolved: 'issue risolte',

    work: {
      eyebrow: 'Progetti',
      title: 'Cosa ho costruito',
      lead: 'Raggruppati per area. I casi studio hanno una pagina dedicata con dettagli, demo e codice.',
      groups: 'Gruppi di progetti',
      count: (n: number) => `${n} ${n === 1 ? 'progetto' : 'progetti'}`,
    },
    education: { eyebrow: 'Formazione', title: 'Studi e lingue' },
    activity: { eyebrow: 'Attività', title: 'Ultimi 12 mesi' },
    code: {
      title: 'Linguaggi sul mio GitHub',
      other: 'Altro',
      row: (name: string, pct: string) => `${name}: ${pct} del codice`,
      size: (size: string) => `${size} di codice`,
      hint: 'Scegli una fetta per i dettagli',
    },
    upstream: {
      eyebrow: 'Upstream',
      title: 'Contributi open source',
      lead: 'Pull e merge request accettate in altri progetti, su GitHub e GitLab.',
      merged: (n: number) => `${n} ${n === 1 ? 'accettata' : 'accettate'}`,
    },
    contact: { eyebrow: 'Contatti', title: 'Scrivimi', lead: "L'email è il modo più rapido per raggiungermi." },

    card: {
      stars: 'Stelle',
      likes: 'Like',
      lastPush: 'Ultimo push',
      push: 'Push',
      platforms: 'Piattaforme',
      weekly: (name: string) => `Download settimanali di ${name}, ultimi 6 mesi`,
      noDescription: 'Ancora nessuna descrizione.',
    },
    kind: { library: 'libreria', app: 'app', tool: 'strumento', system: 'sistema' },

    timeline: { present: 'oggi', inProgress: 'In corso', thesis: 'Tesi', supervisor: 'Relatore' },
    languages: { title: 'Lingue', native: 'Madrelingua', nativeSpeaker: 'madrelingua', cefr: 'livello QCER' },
    graph: {
      contributions: 'contributi',
      activeDays: 'giorni attivi',
      busiest: 'nel giorno più attivo',
      less: 'meno',
      more: 'più',
      day: (n: number, date: string) => `${n} ${n === 1 ? 'contributo' : 'contributi'} il ${date}`,
      year: (n: number) => `${n} contributi nell'ultimo anno`,
      unavailable: 'Dati sui contributi non disponibili —',
      seeOnGitHub: 'guardali su GitHub',
    },
    project: {
      allWork: 'Tutti i progetti',
      stars: 'Stelle GitHub',
      likes: 'Like su pub.dev',
      points: 'Punti pub',
      downloads: 'Download /30g',
      weekly: 'Download settimanali',
      type: 'Tipo',
      platforms: 'Piattaforme',
      latest: 'Ultima versione',
      lastPush: 'Ultimo push',
      stack: 'Stack',
      links: 'Link',
      next: 'Progetto successivo',
    },
    ago: { today: 'oggi', d: (n: number) => `${n} g fa`, mo: (n: number) => `${n} mesi fa`, y: (n: number) => `${n} anni fa` },
  },
} as const;

export type UIStrings = (typeof UI)[Lang];
export const t = (lang: Lang): UIStrings => UI[lang] as UIStrings;
