/* ------------------------------------------------------------
   Screens of my own projects for the home page: the floating
   compositions in the bands and the full sets the lightbox
   walks through. Keyed by the case-study id; the first file of
   a set is what the band shows in front.
   ------------------------------------------------------------ */
import type { ImageMetadata } from 'astro';
import type { Lang } from './i18n';

const files = import.meta.glob<ImageMetadata>('../assets/projects/**/*.{png,jpg,webp}', { eager: true, import: 'default' });
const img = (path: string) => {
  const hit = files[`../assets/projects/${path}`];
  if (!hit) throw new Error(`project screenshot not found: ${path}`);
  return hit;
};

export interface OwnShot {
  src: ImageMetadata;
  /** the same screen in the dark theme, shown instead when the site is dark */
  dark?: ImageMetadata;
  view: Record<Lang, string>;
}

const shot = (path: string, en: string, it: string, dark?: string): OwnShot => ({
  src: img(path),
  dark: dark ? img(dark) : undefined,
  view: { en, it },
});

export const OWN_SHOTS: Record<string, OwnShot[]> = {
  'mpv-audio-kit': [
    shot('mpv-audio-kit/architecture.png', 'architecture', 'architettura'),
    shot('mpv-audio-kit/spectrum_pipeline.png', 'spectrum pipeline', 'pipeline dello spettro'),
    shot('mpv-audio-kit/effects_chain.png', 'effects chain', 'catena degli effetti'),
  ],
  'mpv-studio': [
    shot('mpv-audio-kit/playback-poster.jpg', 'playback', 'riproduzione'),
    shot('mpv-audio-kit/effects-poster.jpg', 'effects', 'effetti'),
    shot('mpv-audio-kit/console-poster.jpg', 'console', 'console'),
    shot('mpv-audio-kit/stream-poster.jpg', 'stream', 'stream'),
  ],
  'dart-smb2': [
    shot('dart-smb2/diagram_architecture.png', 'architecture', 'architettura'),
    shot('dart-smb2/diagram_streaming.png', 'streaming', 'streaming'),
    shot('dart-smb2/diagram_reconnect.png', 'reconnect', 'riconnessione'),
    shot('dart-smb2/diagram_pool_lifecycle.png', 'pool lifecycle', 'ciclo di vita del pool'),
  ],
  'vocem-overlay': [
    shot('vocem-overlay/in-game.png', 'in game', 'in gioco'),
    shot('vocem-overlay/settings-panel.png', 'settings', 'impostazioni'),
    shot('vocem-overlay/settings-appearance.png', 'appearance', 'aspetto'),
    shot('vocem-overlay/settings-applications.png', 'applications', 'applicazioni'),
    shot('vocem-overlay/settings-tray.png', 'tray', 'area di notifica'),
  ],
  netmap: [
    shot('netmap/home.png', 'overview', 'panoramica', 'netmap/home-dark.png'),
    shot('netmap/device.png', 'map', 'mappa'),
    shot('netmap/device-list.png', 'devices', 'dispositivi'),
    shot('netmap/network.png', 'stats', 'statistiche'),
    shot('netmap/phone-map.png', 'on a phone', 'su un telefono'),
    shot('netmap/big-network.png', 'a big network', 'una rete grande'),
  ],
  minesync: [
    shot('minesync/light.png', 'home', 'home', 'minesync/home.png'),
    shot('minesync/session.png', 'hosting a session', 'una sessione in corso'),
    shot('minesync/server.png', 'server', 'server'),
    shot('minesync/mods.png', 'mods', 'mod'),
    shot('minesync/history.png', 'history', 'cronologia'),
    shot('minesync/hub.png', "the hub's web pages", "le pagine web dell'hub"),
    shot('minesync/hub-admin.png', 'admin area', 'area admin'),
  ],
};

/** one screen in the lightbox, as the page hands it to the browser */
export interface LightboxShot {
  src: string;
  /** shown instead in the dark theme */
  dark?: string;
  portrait: boolean;
  /** the screen already has its own device frame */
  framed: boolean;
  alt: string;
  view: string;
  name: string;
  /** where the name links: the repo on GitHub, or my case study */
  href: string;
  link: string;
  stars?: string;
  note: string;
  i: number;
  n: number;
}

/** an app by someone else, as a card of the "built with" gallery */
export interface GalleryApp {
  repo: string;
  name: string;
  /** live from GitHub when the API answers */
  stars: number;
  /** the library of mine it uses */
  pkg: string;
  note: string;
  /** how its screens are composed: phones side by side, or desktop / wide shots stacked */
  kind: 'phone' | 'desk' | 'wide';
  framed: boolean;
  shots: { src: ImageMetadata; alt: string }[];
  /** where its screens start in the lightbox set */
  /** the lightbox set holding this app's screenshots, and only them */
  lbSet: string;
  /** the most-starred app on its library */
  top: boolean;
}
