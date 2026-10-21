import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SearchEngine = 'google' | 'bing' | 'yahoo' | 'duckduckgo' | 'yandex' | 'aol';

export type Tab = {
  id: string;
  title: string;
  url: string;
  domain: string;
  isPrivate: boolean;
  isActive: boolean;
  desktopMode: boolean;
  lastVisited: number;
  icon?: string;
};

export type HistoryEntry = {
  id: string;
  title: string;
  url: string;
  visitTime: number;
};

export type SearchEntry = {
  id: string;
  query: string;
  createdAt: number;
};

export type VideoItem = {
  id: string;
  title: string;
  url: string;
  format: string;
  quality?: string;
  domain: string;
  source: 'page' | 'request';
};

export type BrowserState = {
  searchEngine: SearchEngine;
  tabs: Tab[];
  activeTabId: string | null;
  history: HistoryEntry[];
  recentSearches: SearchEntry[];
  favorites: Array<{ label: string; url: string; icon: string }>;
  privateBrowsingSupported: boolean;
  videoBadgePosition: { x: number; y: number };
  detectedVideos: Record<string, VideoItem[]>;
  setSearchEngine: (engine: SearchEngine) => void;
  createTab: (options?: Partial<Tab>) => Tab;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  updateTab: (tabId: string, updates: Partial<Tab>) => void;
  addRecentSearch: (query: string) => void;
  deleteRecentSearch: (id: string) => void;
  clearRecentSearches: () => void;
  addVisit: (title: string, url: string) => void;
  clearHistory: () => void;
  setVideoBadgePosition: (position: { x: number; y: number }) => void;
  setDetectedVideos: (tabId: string, videos: VideoItem[]) => void;
};

const normalizeUrl = (input: string): string => {
  const trimmed = input.trim();
  if (!trimmed) return 'https://www.google.com';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^file:\/\//i.test(trimmed)) return trimmed;
  const hasDot = /\./.test(trimmed) || /localhost/i.test(trimmed);
  if (hasDot) return `https://${trimmed}`;
  return `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
};

const defaultFavorites = [
  { label: 'Google', url: 'https://www.google.com', icon: 'G' },
  { label: 'YouTube', url: 'https://www.youtube.com', icon: '▶' },
  { label: 'Facebook', url: 'https://www.facebook.com', icon: 'f' },
  { label: 'Wikipedia', url: 'https://www.wikipedia.org', icon: 'W' },
  { label: 'Yandex', url: 'https://www.yandex.com', icon: 'Y' },
  { label: 'X', url: 'https://x.com', icon: 'X' },
  { label: 'Instagram', url: 'https://www.instagram.com', icon: '◎' },
  { label: 'Reddit', url: 'https://www.reddit.com', icon: 'R' },
];

const createBlankTab = (isPrivate = false): Tab => ({
  id: `tab-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  title: 'New tab',
  url: 'https://www.google.com',
  domain: 'google.com',
  isPrivate,
  isActive: false,
  desktopMode: false,
  lastVisited: Date.now(),
  icon: '•',
});

export const useBrowserStore = create<BrowserState>()(
  persist(
    (set, get) => ({
      searchEngine: 'google',
      tabs: [createBlankTab(false)],
      activeTabId: null,
      history: [],
      recentSearches: [],
      favorites: defaultFavorites,
      privateBrowsingSupported: false,
      videoBadgePosition: { x: 20, y: 120 },
      detectedVideos: {},
      setSearchEngine: (engine) => set({ searchEngine: engine }),
      createTab: (options = {}) => {
        const next = {
          ...createBlankTab(options.isPrivate ?? false),
          ...options,
        } as Tab;
        set((state) => ({
          tabs: [...state.tabs, next],
          activeTabId: next.id,
        }));
        return next;
      },
      closeTab: (tabId) => {
        set((state) => {
          const remaining = state.tabs.filter((tab) => tab.id !== tabId);
          if (remaining.length === 0) {
            const fallback = createBlankTab(false);
            return {
              tabs: [fallback],
              activeTabId: fallback.id,
            };
          }
          const nextActive = remaining.find((tab) => tab.id === state.activeTabId) ?? remaining[0];
          return {
            tabs: remaining,
            activeTabId: nextActive.id,
          };
        });
      },
      setActiveTab: (tabId) => {
        set((state) => ({
          tabs: state.tabs.map((tab) => ({
            ...tab,
            isActive: tab.id === tabId,
          })),
          activeTabId: tabId,
        }));
      },
      updateTab: (tabId, updates) => {
        set((state) => ({
          tabs: state.tabs.map((tab) => (tab.id === tabId ? { ...tab, ...updates } : tab)),
        }));
      },
      addRecentSearch: (query) => {
        const trimmed = query.trim();
        if (!trimmed) return;
        set((state) => ({
          recentSearches: [
            { id: `sr-${Date.now()}`, query: trimmed, createdAt: Date.now() },
            ...state.recentSearches.filter((entry) => entry.query.toLowerCase() !== trimmed.toLowerCase()),
          ].slice(0, 100),
        }));
      },
      deleteRecentSearch: (id) => {
        set((state) => ({
          recentSearches: state.recentSearches.filter((entry) => entry.id !== id),
        }));
      },
      clearRecentSearches: () => set({ recentSearches: [] }),
      addVisit: (title, url) => {
        const safeUrl = normalizeUrl(url);
        set((state) => ({
          history: [
            { id: `visit-${Date.now()}`, title, url: safeUrl, visitTime: Date.now() },
            ...state.history.filter((entry) => entry.url !== safeUrl),
          ].slice(0, 100),
        }));
      },
      clearHistory: () => set({ history: [] }),
      setVideoBadgePosition: (position) => set({ videoBadgePosition: position }),
      setDetectedVideos: (tabId, videos) => set((state) => ({
        detectedVideos: {
          ...state.detectedVideos,
          [tabId]: videos,
        },
      })),
    }),
    {
      name: 'moncef-browser-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        searchEngine: state.searchEngine,
        tabs: state.tabs.filter((tab) => !tab.isPrivate),
        activeTabId: state.activeTabId,
        history: state.history,
        recentSearches: state.recentSearches,
        favorites: state.favorites,
        videoBadgePosition: state.videoBadgePosition,
        detectedVideos: Object.fromEntries(
          Object.entries(state.detectedVideos).filter(([key, value]) => value && value.length > 0 && !state.tabs.find((tab) => tab.id === key)?.isPrivate)
        ),
      }),
    }
  )
);

export const getSearchEngineUrl = (engine: SearchEngine, query: string) => {
  const term = encodeURIComponent(query.trim());
  const map: Record<SearchEngine, string> = {
    google: `https://www.google.com/search?q=${term}`,
    bing: `https://www.bing.com/search?q=${term}`,
    yahoo: `https://search.yahoo.com/search?p=${term}`,
    duckduckgo: `https://duckduckgo.com/?q=${term}`,
    yandex: `https://yandex.com/search/?text=${term}`,
    aol: `https://search.aol.com/aol/search?q=${term}`,
  };
  return map[engine];
};

export const getDomain = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return 'example.com';
  }
};

export const getUrlForInput = (raw: string, engine: SearchEngine) => {
  const input = raw.trim();
  if (!input) return null;
  if (/^https?:\/\//i.test(input)) return input;
  if (/^www\./i.test(input)) return `https://${input}`;
  if (/[a-z0-9.-]+\.[a-z]{2,}/i.test(input)) return `https://${input}`;
  return getSearchEngineUrl(engine, input);
};

export const toTitle = (raw: string) => {
  const cleaned = raw.replace(/^https?:\/\//i, '').replace(/\/.*$/, '').replace(/^www\./i, '');
  return cleaned || 'Untitled';
};
