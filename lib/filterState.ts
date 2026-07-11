export interface FilterState {
  showMovies: boolean;
  showTvSeries: boolean;
  showAnime: boolean;
  showSports: boolean;
  selectedSports: string[];
  searchQuery: string;
}

export const DEFAULT_FILTER_STATE: FilterState = {
  showMovies: true,
  showTvSeries: true,
  showAnime: false,
  showSports: false,
  selectedSports: [],
  searchQuery: '',
};

const STORAGE_KEY = 'watchyoFilters';

export function loadFilterState(): FilterState {
  if (typeof window === 'undefined') return DEFAULT_FILTER_STATE;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_FILTER_STATE;
    const parsed = JSON.parse(stored);
    return { ...DEFAULT_FILTER_STATE, ...parsed };
  } catch {
    return DEFAULT_FILTER_STATE;
  }
}

export function saveFilterState(state: FilterState) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
