/* ------------------------------------------------------------
   Islands: a featured package on the home page together with
   what belongs to it. The reference app built on it, the repo
   that builds its native library (both in the package's band),
   and other people's projects that depend on it (in the
   "built with" gallery, apart from my own work).

   The "used by" lists come from a search of GitHub on
   2026-11-21 (pubspec dependencies, vendored copies and git
   dependencies, each checked by hand) and match the public
   list linked below. Stars are refreshed at build time; the
   numbers here are only the fallback.
   ------------------------------------------------------------ */
import type { ImageMetadata } from 'astro';
import type { Lang } from './i18n';

/** public GitHub list with every project that uses one of the libraries */
export const USED_BY_LIST = 'https://github.com/stars/ales-drnz/lists/projects-using-my-libraries';

// screenshots live in src/assets/used-by, named <project>-<view>
const files = import.meta.glob<ImageMetadata>('../assets/used-by/*', { eager: true, import: 'default' });
const img = (name: string) => {
  const hit = Object.entries(files).find(([path]) => path.split('/').pop()!.replace(/\.\w+$/, '') === name);
  if (!hit) throw new Error(`used-by screenshot not found: ${name}`);
  return hit[1];
};

// app icons of the projects without screenshots, from their own repos, named <owner>__<name>.png
const icons = import.meta.glob<ImageMetadata>('../assets/used-by-icons/*.png', { eager: true, import: 'default' });
/** the app's own icon, or undefined (the tile then shows the owner's GitHub avatar) */
export const appIcon = (repo: string) => icons[`../assets/used-by-icons/${repo.replace('/', '__')}.png`];

export interface Shot {
  src: ImageMetadata;
  alt: Record<Lang, string>;
}

export interface UsedBy {
  /** owner/name on GitHub */
  repo: string;
  /** used when the GitHub API is unreachable at build time */
  stars: number;
  /** with screenshots (and MIN_STARS) the project gets a card in the gallery, otherwise it is
      summed up in the line under it. The first screens are the ones on the card. */
  shots?: Shot[];
  /** the screenshots already include a phone frame, so no bezel is drawn around them */
  framed?: boolean;
  /** display name on its tile, for projects with screenshots */
  name?: string;
  note?: Record<Lang, string>;
}

/** only dependents with at least this many stars are shown, the rest are one link to the full list */
export const MIN_STARS = 10;

export interface Island {
  /** case-study id of the reference app built on the package */
  app?: string;
  /** own repos that build the package's native library */
  builtOn: string[];
  /** short line under the native build repo's name */
  buildNote: Record<Lang, string>;
  usedBy: UsedBy[];
}

/** packages without an island that other projects depend on too: how many, as on the public list */
export const OTHER_USED_BY: { pkg: string; count: number }[] = [{ pkg: 'dart_jellyfin', count: 3 }];

/** shots('looper', 'Looper', ['home', 'Home'], ['player', 'Player']): one Shot per view, the view also names the file */
const shots = (project: string, title: string, ...views: [file: string, en: string, it?: string][]): Shot[] =>
  views.map(([file, en, it]) => ({ src: img(`${project}-${file}`), alt: { en: `${title}: ${en}`, it: `${title}: ${it ?? en}` } }));
const note = (en: string, it: string) => ({ en, it });
const chip = (repo: string, stars: number): UsedBy => ({ repo, stars });

/** keyed by the package's case-study id */
export const ISLANDS: Record<string, Island> = {
  'mpv-audio-kit': {
    app: 'mpv-studio',
    builtOn: ['libmpv-scripts'],
    buildNote: note('libmpv and FFmpeg, audio only, built for every platform.', 'libmpv e FFmpeg, solo audio, compilati per ogni piattaforma.'),
    usedBy: [
      {
        repo: 'xiaobaimc/myune_music',
        stars: 504,
        name: 'MyuneMusic',
        shots: shots('myune', 'MyuneMusic', ['spectrum', 'loudness, levels, stereo phase and spectrum', 'loudness, livelli, fase stereo e spettro'], ['lyrics', 'full-screen lyrics', 'testo a schermo intero'], ['library', 'playlist', 'playlist']),
        note: note('Cross-platform local music player, with live loudness, levels and spectrum.', 'Player musicale locale multipiattaforma, con loudness, livelli e spettro in tempo reale.'),
      },
      {
        repo: 'NaivG/bilimusic',
        stars: 237,
        name: 'BiliMusic',
        shots: shots('bilimusic', 'BiliMusic', ['detail', 'player'], ['home', 'home'], ['playlist', 'daily picks', 'consigliati del giorno']),
        note: note('Music player for Bilibili, with a version for HarmonyOS.', 'Player per la musica di Bilibili, con una versione per HarmonyOS.'),
      },
      {
        repo: 'sthrnilshaaa/looper',
        stars: 200,
        name: 'Looper',
        shots: shots('looper', 'Looper', ['home', 'home'], ['player', 'player'], ['lyrics', 'synced lyrics', 'testo sincronizzato'], ['album', 'album']),
        note: note('Offline player for Android, Linux and Windows, with word-synced lyrics and an 18-band EQ.', 'Player offline per Android, Linux e Windows, con testi sincronizzati parola per parola ed EQ a 18 bande.'),
      },
      {
        repo: 'afkcodes/sunoh',
        stars: 57,
        name: 'Sunoh',
        shots: shots('sunoh', 'Sunoh', ['home', 'home with trending albums and charts', 'home con album di tendenza e classifiche'], ['player', 'player'], ['search', 'search', 'ricerca'], ['library', 'library', 'libreria']),
        note: note('Android app that plays YouTube Music, Gaana and Saavn behind one interface.', "App Android che riproduce YouTube Music, Gaana e Saavn da un'unica interfaccia."),
      },
      {
        repo: 'baishu136/myune_music_android',
        stars: 15,
        name: 'MyuneMusic for Android',
        shots: shots('myunea', 'MyuneMusic for Android', ['overview', 'phone and tablet layouts', 'layout per telefono e tablet']),
        note: note('Phone and tablet edition of MyuneMusic.', 'Versione di MyuneMusic per telefono e tablet.'),
      },
      {
        repo: 'Aetherfin/mobile-app',
        stars: 11,
        name: 'Aetherfin',
        shots: shots('aetherfin', 'Aetherfin', ['now-playing', 'now playing', 'in riproduzione'], ['albums', 'album library', 'libreria album'], ['account', 'account with Jellyfin library stats', 'account con le statistiche della libreria Jellyfin'], ['settings', 'playback settings', 'impostazioni di riproduzione']),
        note: note('Android player for self-hosted Jellyfin and Navidrome servers.', 'Player Android per server Jellyfin e Navidrome self-hosted.'),
      },
      {
        repo: 'MoathCodes/tawaq-app',
        stars: 2,
        name: 'Tawaq',
        shots: shots('tawaq', 'Tawaq', ['recitation', 'recitation player', 'player delle recitazioni'], ['analytics', 'prayer analytics', 'statistiche delle preghiere'], ['settings', 'settings', 'impostazioni']),
        note: note('Prayer times, Quran study and a recitation player.', 'Orari di preghiera, studio del Corano e un player per le recitazioni.'),
      },
      {
        repo: 'redevined/intrval-music-player',
        stars: 1,
        name: 'intrval',
        shots: shots('intrval', 'intrval', ['player', 'player with tempo slider', 'player con lo slider del tempo'], ['library', 'library with BPM per track', 'libreria con i BPM di ogni brano'], ['sets', 'practice sets', 'set di allenamento'], ['edit', 'set entry with tempo and duration overrides', 'voce di un set con tempo e durata personalizzati']),
        note: note('Music player for ballroom dancing practice, with tempo control.', 'Player musicale per allenarsi nel ballo da sala, con controllo del tempo.'),
      },
      chip('devvlooper/LooperMusic', 14),
      chip('yhsj0919/MixMusic', 8),
      chip('MatheusWDB/music-wave-player', 1),
      chip('TechPsychotic/harp', 0),
      chip('ashford232/maxtune-player', 0),
      chip('liuchuancong/media_core', 0),
      chip('luciferr1212/aestheticy', 0),
      chip('luciferr1212/aestheticy-arg', 0),
      chip('Alizesa/Motif-Music', 0),
    ],
  },
  'dart-smb2': {
    builtOn: ['libsmb2-scripts'],
    buildNote: note('libsmb2 with my patches, built for every platform.', 'libsmb2 con le mie patch, compilato per ogni piattaforma.'),
    usedBy: [
      {
        repo: 'mornyeapp/Mornye',
        stars: 8095,
        name: 'Mornye',
        shots: shots('mornye', 'Mornye', ['dark', 'library, player, lyrics and equalizer', 'libreria, player, testi ed equalizzatore'], ['light', 'the same screens in the light theme', 'le stesse schermate con il tema chiaro']),
        note: note('Mobile music app built with Flutter and Rust.', 'App musicale per telefono scritta in Flutter e Rust.'),
      },
      {
        repo: 'varunsalian/debrify',
        stars: 663,
        name: 'Debrify',
        shots: shots('debrify', 'Debrify', ['episodes', 'episodes', 'episodi'], ['search', 'search', 'ricerca'], ['catalog', 'catalog', 'catalogo']),
        note: note('Personal media hub to browse, stream and organise your media.', 'Hub multimediale personale per sfogliare, riprodurre e organizzare i tuoi contenuti.'),
      },
      {
        repo: 'axel10/vynody',
        stars: 179,
        name: 'Vynody',
        shots: shots('vynody', 'Vynody', ['playback', 'playback'], ['lyric', 'lyrics', 'testo'], ['album', 'albums', 'album'], ['navidrome', 'Navidrome library', 'libreria Navidrome']),
        note: note('Feature-rich Flutter music player for desktop and mobile.', 'Player musicale in Flutter, ricco di funzioni, per desktop e mobile.'),
      },
      {
        repo: 'lokal-music/mobile',
        stars: 145,
        name: 'Lokal',
        shots: shots('lokal', 'Lokal', ['home', 'home'], ['library', 'library', 'libreria']),
        note: note('Mobile player for your own music files, with synced lyrics.', 'Player mobile per i tuoi file musicali, con testi sincronizzati.'),
      },
      {
        repo: 'sen-to/mochi_player',
        stars: 123,
        name: 'Mochi Player',
        shots: shots('mochi', 'Mochi Player', ['home', 'home'], ['detail', 'series page', 'pagina di una serie'], ['browser', 'file browser', 'esplora file']),
        note: note('Media library player for macOS and Windows, with local, WebDAV and SMB sources.', 'Player per la libreria multimediale su macOS e Windows, con sorgenti locali, WebDAV e SMB.'),
      },
      {
        repo: 'lonnnnnng/fluxdown',
        stars: 120,
        name: 'FluxDown',
        shots: shots('fluxdown', 'FluxDown', ['list', 'downloads', 'download'], ['new', 'new task', 'nuova attività'], ['settings', 'settings', 'impostazioni']),
        note: note('Cross-platform downloader for many protocols.', 'Downloader multipiattaforma per molti protocolli.'),
      },
      {
        repo: 'catpuppyapp/HahaNote-Release',
        stars: 38,
        name: 'HahaNote',
        framed: true,
        shots: shots('hahanote', 'HahaNote', ['1', 'sync', 'sincronizzazione'], ['2', 'editor'], ['3', 'files', 'file']),
        note: note('File-based notes with end-to-end encrypted sync.', 'Note basate su file, sincronizzate con crittografia end-to-end.'),
      },
      {
        repo: 'voidvon/maimai-ktv',
        stars: 32,
        name: 'maimai KTV',
        shots: shots('maimai', 'maimai KTV', ['desktop', 'song picker', 'scelta dei brani']),
        note: note('Karaoke app for desktop and mobile.', 'App di karaoke per desktop e mobile.'),
      },
      {
        repo: 'freeKC/Immuch360',
        stars: 22,
        name: 'Immuch360',
        shots: shots('immuch', 'Immuch360', ['platforms', 'the app on phones, TVs and headsets', "l'app su telefoni, TV e visori"], ['hero', 'overview', 'panoramica']),
        note: note('Flat, 360° and 3D photos and videos from your device, NAS or Immich server.', 'Foto e video normali, a 360° e 3D dal dispositivo, dal NAS o da un server Immich.'),
      },
      {
        repo: 'joywareapps/foc-companion',
        stars: 6,
        name: 'FOC Companion',
        shots: shots('foc', 'FOC Companion', ['1', '3-phase calibration', 'calibrazione trifase'], ['2', '4-phase calibration', 'calibrazione a 4 fasi'], ['3', 'pulse settings', 'impostazioni degli impulsi']),
        note: note('Companion app to calibrate and drive a pulse device.', 'App per calibrare e pilotare un dispositivo a impulsi.'),
      },
      chip('opaiopaio/Venera-Nas', 26),
      chip('huangshi10492/flutter_danmaku_player', 4),
      chip('renierr/toollab', 3),
      chip('snapetech-org/pleazyng', 3),
      chip('CrispStrobe/CrispCloud', 1),
      chip('Nihmar/cbzmanager', 1),
      chip('PhoPersonalOrg/flutter_application_final_emotiv_logger', 1),
      chip('foliageSea/Azusa', 0),
      chip('miludeshiji/Reelva', 0),
      chip('victoralvelais/navidrome-hyperstream', 0),
      chip('wsciaroni/TrueTransfer', 0),
      chip('zzzhr1990/player_demo', 0),
      chip('liakos356/VR-App-Manager-Flutter', 0),
      chip('chenshi221/tidyreel', 0),
      chip('TranDangKhoaAutomation/Nas-For-Xiaomi-AC1200-Openwrt', 0),
    ],
  },
};

/** project ids and repo names that live inside an island */
export const islandMembers = () => ({
  projects: new Set(Object.values(ISLANDS).flatMap((i) => (i.app ? [i.app] : []))),
  repos: new Set(Object.values(ISLANDS).flatMap((i) => i.builtOn)),
});
