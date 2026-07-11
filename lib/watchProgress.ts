const STORAGE_PREFIX = 'watchyoTvProgress:';

export interface TvProgress {
  season: number;
  episode: number;
}

export function saveTvProgress(showId: string, progress: TvProgress) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_PREFIX + showId, JSON.stringify(progress));
  } catch {
    // localStorage can be unavailable (private mode, quota) — resume is a nicety, not critical.
  }
}

export function loadTvProgress(showId: string): TvProgress | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + showId);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.season === 'number' && typeof parsed?.episode === 'number') {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}
