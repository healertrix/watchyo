export const WATCHFOOTY_ASSET_BASE = 'https://api.watchfooty.st';

export function assetUrl(path: string | undefined | null): string | undefined {
  if (!path) return undefined;
  return path.startsWith('http') ? path : `${WATCHFOOTY_ASSET_BASE}${path}`;
}

export interface SportInfo {
  name: string;
  displayName: string;
}

export interface SportsStream {
  id: string;
  url: string;
  quality: string;
  language: string;
  isRedirect: boolean;
  nsfw: boolean;
  ads: boolean;
}

export interface SportsTeam {
  name: string;
  logoUrl?: string;
  logoId?: string;
}

export interface SportsMatch {
  matchId: string;
  title: string;
  poster?: string;
  teams: {
    home: SportsTeam;
    away: SportsTeam;
  };
  scores?: {
    home: number;
    away: number;
  };
  status?: string;
  currentMinute?: string;
  currentMinuteNumber?: number;
  isEvent: boolean;
  date: string;
  timestamp: number;
  league: string;
  leagueLogo?: string;
  leagueLogoId?: string;
  sport: string;
  streams: SportsStream[];
}

const LIVE_WINDOW_MS = 3 * 60 * 60 * 1000;
const LIVE_STATUSES = new Set(['in', 'live', 'in_progress', 'inprogress']);
const UPCOMING_STATUSES = new Set(['pre', 'scheduled', 'not_started']);
const FINISHED_STATUSES = new Set(['post', 'final', 'ft', 'ended', 'finished']);

// The API returns `timestamp` in milliseconds despite its docs example implying seconds.
// Guard against either shape: treat anything already bigger than a plausible seconds value as ms.
export function toMs(timestamp: number): number {
  return timestamp > 1e12 ? timestamp : timestamp * 1000;
}

export function isMatchLive(match: SportsMatch): boolean {
  const status = match.status?.toLowerCase();
  if (status) {
    if (LIVE_STATUSES.has(status)) return true;
    if (UPCOMING_STATUSES.has(status) || FINISHED_STATUSES.has(status)) return false;
  }

  const startMs = toMs(match.timestamp);
  const now = Date.now();
  return now >= startMs && now <= startMs + LIVE_WINDOW_MS;
}

export function isMatchUpcoming(match: SportsMatch): boolean {
  const status = match.status?.toLowerCase();
  if (status && UPCOMING_STATUSES.has(status)) return true;
  if (status && (LIVE_STATUSES.has(status) || FINISHED_STATUSES.has(status))) return false;
  return toMs(match.timestamp) > Date.now();
}

export function isMatchFinished(match: SportsMatch): boolean {
  const status = match.status?.toLowerCase();
  if (status) return FINISHED_STATUSES.has(status);
  return false;
}

// Scores/minutes are -1 before kickoff; only show them once real values exist.
export function validScore(score: number | undefined): number | undefined {
  return score !== undefined && score >= 0 ? score : undefined;
}

export function bestStream(match: SportsMatch): SportsStream | undefined {
  const streams = match.streams ?? [];
  const safe = streams.filter((s) => !s.nsfw);
  const noAds = safe.filter((s) => !s.ads);
  // Redirect streams point at pages meant to be opened directly, not embedded in an
  // iframe (they often refuse to be framed and just render a blank/black screen).
  // Prefer an embeddable stream when one exists so the in-page player actually works.
  const embeddable = noAds.filter((s) => !s.isRedirect);
  return embeddable[0] ?? noAds[0] ?? safe[0] ?? streams[0];
}

export function hasWatchableStream(match: SportsMatch): boolean {
  return (match.streams ?? []).length > 0;
}
