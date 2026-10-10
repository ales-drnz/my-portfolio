export const SITE = {
  name: 'Alessandro Di Ronza',
  handle: 'ales-drnz',
  url: 'https://ales-drnz.com',
  title: 'Alessandro Di Ronza',
  description:
    'Building open-source tools and apps. M.Sc. Telecommunications Engineering student at Sapienza University of Rome.',
  role: 'M.Sc. student in Telecommunications Engineering · Sapienza University of Rome',
  avatar: 'https://avatars.githubusercontent.com/u/82038599?v=4',
  publisher: 'ales-drnz.com',
  // assembled at runtime to keep it away from naive scrapers
  emailParts: ['ales', 'drnz', 'gmail.com'] as const,
};

export const SOCIALS = [
  { id: 'github', label: 'GitHub', url: 'https://github.com/ales-drnz' },
  { id: 'pubdev', label: 'pub.dev', url: 'https://pub.dev/publishers/ales-drnz.com/packages' },
  { id: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/alessandro-di-ronza-911587241' },
  { id: 'x', label: 'X', url: 'https://x.com/ales_drnz' },
  { id: 'instagram', label: 'Instagram', url: 'https://instagram.com/ales.drnz' },
  { id: 'patreon', label: 'Patreon', url: 'https://www.patreon.com/cw/ales_drnz' },
] as const;

export interface EducationEntry {
  start: string;
  end: string | null; // null = in progress
  degree: string;
  school: string;
  place: string;
  grade?: string;
  thesis?: { title: string; supervisor: string; summary: string };
}

// newest first
export const EDUCATION: EducationEntry[] = [
  {
    start: 'Sep 2025',
    end: null,
    degree: 'M.Sc. Telecommunications Engineering',
    school: 'Sapienza University of Rome',
    place: 'Rome',
  },
  {
    start: '2022',
    end: 'Dec 2025',
    degree: 'B.Sc. Electronic Engineering',
    school: 'Sapienza University of Rome',
    place: 'Rome',
    grade: '106/110',
    thesis: {
      title: 'Wi-Fi 7 (IEEE 802.11be): Innovations, Performance and Comparison with Wi-Fi 6',
      supervisor: 'Prof. Luca De Nardis',
      summary:
        'Reviewed 4096-QAM, 320 MHz channels and Multi-Link Operation, and compared Wi-Fi 7 with Wi-Fi 6 using analytical models and published results.',
    },
  },
  {
    start: '2017',
    end: '2022',
    degree: 'Scientific High School Diploma',
    school: 'Liceo Innocenzo XII',
    place: 'Anzio',
    grade: '100/100 cum laude',
  },
];

export const CEFR = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

export interface Language {
  name: string;
  flag: 'it' | 'gb';
  /** a CEFR level, or 'native' */
  level: (typeof CEFR)[number] | 'native';
  levelLabel: string;
  certificate?: { name: string; score?: string };
}

export const LANGUAGES: Language[] = [
  { name: 'Italian', flag: 'it', level: 'native', levelLabel: 'Mother tongue' },
  {
    name: 'English',
    flag: 'gb',
    level: 'B2',
    levelLabel: 'Upper intermediate',
    certificate: { name: 'Cambridge B2 First', score: '179' },
  },
];

/* Project groups on the home page. Case studies pick a group in their frontmatter;
   plain GitHub repos are placed by name, and anything unlisted lands in "other". */
export type ProjectGroupId = 'dart' | 'linux' | 'build' | 'other';

export const PROJECT_GROUPS: {
  id: ProjectGroupId;
  title: string;
  description: string;
  brand?: string; // simple-icons export name
  octicon?: string; // fallback when there's no brand logo
  repos: string[];
}[] = [
  {
    id: 'dart',
    title: 'Flutter & Dart',
    description: 'Packages published on pub.dev, and the apps built on them.',
    brand: 'siDart',
    repos: ['mpv_studio'],
  },
  {
    id: 'linux',
    title: 'Linux & systems',
    description: 'Low-level tools for the Linux desktop.',
    brand: 'siLinux',
    repos: [],
  },
  {
    id: 'build',
    title: 'Native build tooling',
    description: 'Reproducible cross-platform builds of the C libraries behind the Dart packages.',
    octicon: 'tools',
    repos: ['libmpv-scripts', 'libsmb2-scripts'],
  },
  {
    id: 'other',
    title: 'Other',
    description: 'Everything else on GitHub.',
    octicon: 'repo',
    repos: [],
  },
];

/** logos for plain GitHub repos (case studies set theirs in frontmatter) */
export const REPO_LOGOS: Record<string, string> = {
  mpv_studio: 'mpv-audio-kit/mpv_studio.png',
};

// icon: a simple-icons export name
export const SKILLS: { label: string; icon?: string }[] = [
  { label: 'Dart', icon: 'siDart' },
  { label: 'Flutter', icon: 'siFlutter' },
  { label: 'C', icon: 'siC' },
  { label: 'C++', icon: 'siCplusplus' },
  { label: 'Python', icon: 'siPython' },
  { label: 'Swift', icon: 'siSwift' },
  { label: 'Vulkan', icon: 'siVulkan' },
  { label: 'Qt', icon: 'siQt' },
  { label: 'Docker', icon: 'siDocker' },
  { label: 'GitHub Actions', icon: 'siGithubactions' },
];

// GitHub linguist colors
export const LANG_COLORS: Record<string, string> = {
  Dart: '#00B4AB',
  Python: '#3572A5',
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  C: '#555555',
  'C++': '#f34b7d',
  Shell: '#89e051',
  Go: '#00ADD8',
  Rust: '#dea584',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
  HTML: '#e34c26',
  CSS: '#563d7c',
};
