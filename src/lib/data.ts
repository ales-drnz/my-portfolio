/* ------------------------------------------------------------
   Build-time data. Everything here runs during `astro build`
   (and nightly in CI), never in the visitor's browser: no rate
   limits, no layout shift, and the numbers are in the HTML.
   Every fetch degrades to an empty/neutral value so a flaky API
   never breaks the build.
   ------------------------------------------------------------ */
import { SITE } from './site';

const GH = 'https://api.github.com';
const token = import.meta.env.GITHUB_TOKEN ?? process.env.GITHUB_TOKEN;
const ghHeaders: Record<string, string> = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'ales-drnz-portfolio',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

async function getJson<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, init);
    if (!res.ok) {
      console.warn(`[data] ${res.status} ${url}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`[data] failed ${url}:`, err);
    return null;
  }
}

// one in-flight promise per key, shared by every page of the build
const cache = new Map<string, Promise<unknown>>();
function memo<T>(key: string, fn: () => Promise<T>): Promise<T> {
  if (!cache.has(key)) cache.set(key, fn());
  return cache.get(key) as Promise<T>;
}

/* ---------------- GitHub ---------------- */

export interface Repo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  archived: boolean;
  topics: string[];
  pushed_at: string;
}

export interface GithubUser {
  followers: number;
  public_repos: number;
}

export const getRepos = () =>
  memo('repos', async () => {
    const repos = await getJson<Repo[]>(`${GH}/users/${SITE.handle}/repos?per_page=100&sort=pushed`, {
      headers: ghHeaders,
    });
    return repos ?? [];
  });

export const getUser = () =>
  memo('user', () => getJson<GithubUser>(`${GH}/users/${SITE.handle}`, { headers: ghHeaders }));

export async function getRepo(name: string): Promise<Repo | undefined> {
  return (await getRepos()).find((r) => r.name === name);
}

export interface UpstreamPR {
  title: string;
  url: string;
  repo: string;
  mergedAt: string;
}

/** Pull requests merged into other people's repositories. */
export const getUpstreamPRs = () =>
  memo('prs', async (): Promise<UpstreamPR[]> => {
    const q = encodeURIComponent(`author:${SITE.handle} type:pr is:merged -user:${SITE.handle}`);
    const res = await getJson<{ items: any[] }>(`${GH}/search/issues?q=${q}&sort=created&order=desc&per_page=30`, {
      headers: ghHeaders,
    });
    return (res?.items ?? []).map((i) => ({
      title: i.title,
      url: i.html_url,
      repo: i.repository_url.replace(`${GH}/repos/`, ''),
      mergedAt: i.pull_request?.merged_at ?? i.closed_at,
    }));
  });

/* ---------------- contributions ---------------- */

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

/** Last ~year of contributions. Uses GraphQL when a token is available, else a public mirror. */
export const getContributions = () =>
  memo('contrib', async (): Promise<{ total: number; days: ContributionDay[] }> => {
    if (token) {
      const query = `query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{
        totalContributions weeks{contributionDays{date contributionCount contributionLevel}}}}}}`;
      const res = await getJson<any>('https://api.github.com/graphql', {
        method: 'POST',
        headers: { ...ghHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables: { login: SITE.handle } }),
      });
      const cal = res?.data?.user?.contributionsCollection?.contributionCalendar;
      if (cal) {
        const levels: Record<string, ContributionDay['level']> = {
          NONE: 0,
          FIRST_QUARTILE: 1,
          SECOND_QUARTILE: 2,
          THIRD_QUARTILE: 3,
          FOURTH_QUARTILE: 4,
        };
        return {
          total: cal.totalContributions,
          days: cal.weeks.flatMap((w: any) =>
            w.contributionDays.map((d: any) => ({
              date: d.date,
              count: d.contributionCount,
              level: levels[d.contributionLevel] ?? 0,
            })),
          ),
        };
      }
    }
    const res = await getJson<{ total: { lastYear: number }; contributions: ContributionDay[] }>(
      `https://github-contributions-api.jogruber.de/v4/${SITE.handle}?y=last`,
    );
    return { total: res?.total.lastYear ?? 0, days: res?.contributions ?? [] };
  });

/* ---------------- pub.dev ---------------- */

export interface PubPackage {
  name: string;
  version: string | null;
  description: string | null;
  likes: number;
  downloads30d: number;
  points: number | null;
  maxPoints: number | null;
  platforms: string[];
  /** weekly downloads, oldest → newest */
  weekly: number[];
}

export const getPackage = (name: string) =>
  memo(`pub:${name}`, async (): Promise<PubPackage | null> => {
    const [info, metrics] = await Promise.all([
      getJson<any>(`https://pub.dev/api/packages/${name}`),
      getJson<any>(`https://pub.dev/api/packages/${name}/metrics`),
    ]);
    if (!info && !metrics) return null;
    const score = metrics?.score ?? {};
    const weeklyNewestFirst: number[] = metrics?.scorecard?.weeklyVersionDownloads?.totalWeeklyDownloads ?? [];
    // trim the zero tail from before the package existed
    let end = weeklyNewestFirst.length;
    while (end > 0 && weeklyNewestFirst[end - 1] === 0) end--;
    return {
      name,
      version: info?.latest?.version ?? null,
      description: info?.latest?.pubspec?.description ?? null,
      likes: score.likeCount ?? 0,
      downloads30d: score.downloadCount30Days ?? 0,
      // maxPoints is 0 while pub.dev re-analyzes a fresh release
      points: score.maxPoints ? score.grantedPoints : null,
      maxPoints: score.maxPoints || null,
      platforms: (score.tags ?? [])
        .filter((t: string) => t.startsWith('platform:'))
        .map((t: string) => t.slice('platform:'.length)),
      weekly: weeklyNewestFirst.slice(0, end).reverse(),
    };
  });

/** Packages = repos whose homepage points to pub.dev. */
export async function getPackages(): Promise<PubPackage[]> {
  const names = (await getRepos())
    .map((r) => (r.homepage ?? '').match(/^https:\/\/pub\.dev\/packages\/([\w-]+)/)?.[1])
    .filter((n): n is string => Boolean(n));
  const pkgs = await Promise.all(names.map(getPackage));
  return pkgs.filter((p): p is PubPackage => p !== null).sort((a, b) => b.downloads30d - a.downloads30d);
}

/* ---------------- helpers ---------------- */

export function timeAgo(date: string | Date): string {
  const days = Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000);
  if (days < 1) return 'today';
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export const compact = (n: number) =>
  new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n);
