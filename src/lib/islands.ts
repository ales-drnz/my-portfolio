/* ------------------------------------------------------------
   Islands: a featured package on the home page together with
   what belongs to it. The reference app built on it, the repo
   that builds its native library, and other people's projects
   that depend on it. Everything listed here is taken out of
   the ordinary group grids so it shows up only once.
   ------------------------------------------------------------ */
import type { ImageMetadata } from 'astro';
import type { Lang } from './i18n';
import myuneSpectrum from '../assets/used-by/myune-spectrum.png';
import myuneLyrics from '../assets/used-by/myune-lyrics.png';
import myuneLibrary from '../assets/used-by/myune-library.png';
import sunohHome from '../assets/used-by/sunoh-home.png';
import sunohPlayer from '../assets/used-by/sunoh-player.png';
import sunohSearch from '../assets/used-by/sunoh-search.png';
import sunohLibrary from '../assets/used-by/sunoh-library.png';
import aetherfinNowPlaying from '../assets/used-by/aetherfin-now-playing.jpg';
import aetherfinAlbums from '../assets/used-by/aetherfin-albums.jpg';
import aetherfinAccount from '../assets/used-by/aetherfin-account.jpg';
import aetherfinSettings from '../assets/used-by/aetherfin-settings.jpg';
import intrvalPlayer from '../assets/used-by/intrval-player.png';
import intrvalLibrary from '../assets/used-by/intrval-library.png';
import intrvalSets from '../assets/used-by/intrval-sets.png';
import intrvalEdit from '../assets/used-by/intrval-edit.png';

export interface UsedBy {
  /** owner/name on GitHub */
  repo: string;
  /** the first one is shown at rest, the others take turns while the card is hovered */
  shots: Shot[];
  /** used when the GitHub API is unreachable at build time */
  stars: number;
  note: Record<Lang, string>;
}

export interface Shot {
  src: ImageMetadata;
  alt: Record<Lang, string>;
}

const shot = (src: ImageMetadata, en: string, it: string): Shot => ({ src, alt: { en, it } });

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
        shots: [
          shot(myuneSpectrum, 'MyuneMusic on desktop: loudness, levels, stereo phase and spectrum', 'MyuneMusic su desktop: loudness, livelli, fase stereo e spettro'),
          shot(myuneLyrics, 'MyuneMusic full-screen lyrics', 'Testo a schermo intero in MyuneMusic'),
          shot(myuneLibrary, 'MyuneMusic playlist view', 'Vista playlist di MyuneMusic'),
        ],
        stars: 501,
        note: {
          en: 'Cross-platform local music player, with live loudness, levels and spectrum.',
          it: 'Player musicale locale multipiattaforma, con loudness, livelli e spettro in tempo reale.',
        },
      },
      {
        repo: 'afkcodes/sunoh',
        shots: [
          shot(sunohHome, 'Sunoh home screen with trending albums and charts', 'Schermata home di Sunoh con album di tendenza e classifiche'),
          shot(sunohPlayer, 'Sunoh player', 'Player di Sunoh'),
          shot(sunohSearch, 'Sunoh search', 'Ricerca in Sunoh'),
          shot(sunohLibrary, 'Sunoh library', 'Libreria di Sunoh'),
        ],
        stars: 55,
        note: {
          en: 'Android app that plays YouTube Music, Gaana and Saavn behind one interface.',
          it: "App Android che riproduce YouTube Music, Gaana e Saavn da un'unica interfaccia.",
        },
      },
      {
        repo: 'Aetherfin/mobile-app',
        shots: [
          shot(aetherfinNowPlaying, 'Aetherfin now playing screen', 'Schermata di riproduzione di Aetherfin'),
          shot(aetherfinAlbums, 'Aetherfin album library', 'Libreria album di Aetherfin'),
          shot(aetherfinAccount, 'Aetherfin account page with Jellyfin library stats', 'Pagina account di Aetherfin con le statistiche della libreria Jellyfin'),
          shot(aetherfinSettings, 'Aetherfin playback settings', 'Impostazioni di riproduzione di Aetherfin'),
        ],
        stars: 10,
        note: {
          en: 'Android player for self-hosted Jellyfin and Navidrome servers.',
          it: 'Player Android per server Jellyfin e Navidrome self-hosted.',
        },
      },
      {
        repo: 'redevined/intrval-music-player',
        shots: [
          shot(intrvalPlayer, 'intrval player with tempo slider', 'Player di intrval con lo slider del tempo'),
          shot(intrvalLibrary, 'intrval library with BPM per track', 'Libreria di intrval con i BPM di ogni brano'),
          shot(intrvalSets, 'intrval practice sets', 'Set di allenamento in intrval'),
          shot(intrvalEdit, 'intrval set entry with tempo and duration overrides', 'Voce di un set in intrval con tempo e durata personalizzati'),
        ],
        stars: 0,
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
