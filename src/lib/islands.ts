/* ------------------------------------------------------------
   Islands: a featured package on the home page together with
   what belongs to it. The reference app built on it, the repo
   that builds its native library, and other people's projects
   that depend on it. Everything listed here is taken out of
   the ordinary group grids so it shows up only once.
   ------------------------------------------------------------ */
import type { ImageMetadata } from 'astro';
import type { Lang } from './i18n';
import myuneMusic from '../assets/used-by/myune-music.png';
import sunoh from '../assets/used-by/sunoh.png';
import aetherfin from '../assets/used-by/aetherfin.jpg';
import intrval from '../assets/used-by/intrval.png';

export interface UsedBy {
  /** owner/name on GitHub */
  repo: string;
  shot: ImageMetadata;
  /** used when the GitHub API is unreachable at build time */
  stars: number;
  alt: Record<Lang, string>;
  note: Record<Lang, string>;
}

export interface Island {
  /** case-study id of the reference app built on the package */
  app?: string;
  /** own repos that build the package's native library */
  builtOn: string[];
  usedBy: UsedBy[];
}

/** keyed by the package's case-study id */
export const ISLANDS: Record<string, Island> = {
  'mpv-audio-kit': {
    app: 'mpv-studio',
    builtOn: ['libmpv-scripts'],
    // stars as of 2026-11-17, all on mpv_audio_kit from pub.dev
    usedBy: [
      {
        repo: 'xiaobaimc/myune_music',
        shot: myuneMusic,
        stars: 501,
        alt: {
          en: 'MyuneMusic on desktop: loudness, levels, stereo phase and spectrum views',
          it: 'MyuneMusic su desktop: loudness, livelli, fase stereo e spettro',
        },
        note: {
          en: 'Cross-platform local music player, with live loudness, levels and spectrum.',
          it: 'Player musicale locale multipiattaforma, con loudness, livelli e spettro in tempo reale.',
        },
      },
      {
        repo: 'afkcodes/sunoh',
        shot: sunoh,
        stars: 55,
        alt: { en: 'Sunoh home screen with trending albums and charts', it: 'Schermata home di Sunoh con album di tendenza e classifiche' },
        note: {
          en: 'Android app that plays YouTube Music, Gaana and Saavn behind one interface.',
          it: "App Android che riproduce YouTube Music, Gaana e Saavn da un'unica interfaccia.",
        },
      },
      {
        repo: 'Aetherfin/mobile-app',
        shot: aetherfin,
        stars: 10,
        alt: { en: 'Aetherfin now playing screen', it: 'Schermata di riproduzione di Aetherfin' },
        note: {
          en: 'Android player for self-hosted Jellyfin and Navidrome servers.',
          it: 'Player Android per server Jellyfin e Navidrome self-hosted.',
        },
      },
      {
        repo: 'redevined/intrval-music-player',
        shot: intrval,
        stars: 0,
        alt: { en: 'intrval player with tempo slider', it: 'Player di intrval con lo slider del tempo' },
        note: {
          en: 'Music player for ballroom dancing practice, with tempo control.',
          it: 'Player musicale per allenarsi nel ballo da sala, con controllo del tempo.',
        },
      },
    ],
  },
  'dart-smb2': {
    builtOn: ['libsmb2-scripts'],
    usedBy: [],
  },
};

/** project ids and repo names that live inside an island */
export const islandMembers = () => ({
  projects: new Set(Object.values(ISLANDS).flatMap((i) => (i.app ? [i.app] : []))),
  repos: new Set(Object.values(ISLANDS).flatMap((i) => i.builtOn)),
});
