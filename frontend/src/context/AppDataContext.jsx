import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { deleteBookmark, fetchBookmarks, saveBookmark } from '../api/bookmarks.js';
import { fetchPRDetail, fetchPRs, fetchRouterStatus, summarizePR as summarizePRRequest } from '../api/prs.js';
import { fetchUserSettings, updateUserSettings } from '../api/settings.js';

const AppDataContext = createContext(null);

const PAGE_SIZE = 20;
const SAVED_STORAGE_KEY = 'pr-intel.frontend2.saved-prs';
const SETTINGS_STORAGE_KEY = 'pr-intel.frontend2.settings';

const DEFAULT_SETTINGS = {
  displayName: 'Alex Rivera',
  username: '@arivera_dev',
  darkMode: false,
  notifications: true,
};

function readSavedState() {
  if (typeof window === 'undefined') return { pr: {}, kb: {}, contributor: {} };

  try {
    const parsed = JSON.parse(window.localStorage.getItem(SAVED_STORAGE_KEY) || '{}');
    if (parsed.pr || parsed.kb || parsed.contributor) return parsed;
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return { pr: parsed, kb: {}, contributor: {} };
    }
    return { pr: {}, kb: {}, contributor: {} };
  } catch {
    return { pr: {}, kb: {}, contributor: {} };
  }
}

function readLocalSettings() {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(SETTINGS_STORAGE_KEY) || 'null');
    return parsed ? { ...DEFAULT_SETTINGS, ...parsed } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function bookmarksArrayToMap(items = []) {
  const map = {};
  for (const item of items) {
    if (item?.id) map[String(item.id)] = item;
  }
  return map;
}

function makeSavedRecord(pr, detail, summary, existing) {
  const source = detail?.pr || pr || existing?.pr;
  if (!source?.number) return existing || null;

  return {
    id: String(source.number),
    type: 'pr',
    savedAt: existing?.savedAt || new Date().toISOString(),
    pr: {
      number: source.number,
      title: source.title,
      body: source.body || '',
      merged_at: source.merged_at,
      html_url: source.html_url,
      additions: source.additions,
      deletions: source.deletions,
      changed_files: source.changed_files,
      labels: source.labels || [],
      user: source.user || { login: 'unknown', avatar_url: '' },
    },
    summary: summary || existing?.summary || null,
    files: detail?.files || existing?.files || [],
    comments: detail?.comments || existing?.comments || [],
  };
}

export function AppDataProvider({ children }) {
  const [pageMap, setPageMap] = useState({});
  const [loadedPages, setLoadedPages] = useState([]);
  const [feedError, setFeedError] = useState(null);
  const [feedLoading, setFeedLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [detailCache, setDetailCache] = useState({});
  const [detailLoading, setDetailLoading] = useState({});
  const [summaryCache, setSummaryCache] = useState({});
  const [summaryLoading, setSummaryLoading] = useState({});
  const [routerStatus, setRouterStatus] = useState(null);
  const [routerStatusLoading, setRouterStatusLoading] = useState(false);
  const [savedBuckets, setSavedBuckets] = useState(readSavedState);
  const [settings, setSettings] = useState(readLocalSettings);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.document.documentElement.dataset.theme = settings.darkMode ? 'dark' : 'light';
    }
  }, [settings.darkMode]);

  const feedItems = useMemo(
    () => loadedPages.flatMap((page) => pageMap[page] || []),
    [loadedPages, pageMap]
  );

  const persistSavedBuckets = useCallback((next) => {
    setSavedBuckets(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(next));
    }
  }, []);

  const persistSettings = useCallback((next) => {
    setSettings(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [prBookmarks, kbBookmarks, contributorBookmarks, remoteSettings] = await Promise.all([
          fetchBookmarks('pr'),
          fetchBookmarks('kb'),
          fetchBookmarks('contributor'),
          fetchUserSettings(),
        ]);
        persistSavedBuckets({
          pr: bookmarksArrayToMap(prBookmarks),
          kb: bookmarksArrayToMap(kbBookmarks),
          contributor: bookmarksArrayToMap(contributorBookmarks),
        });
        persistSettings({ ...DEFAULT_SETTINGS, ...remoteSettings });
      } catch {
        /* offline or backend starting — keep local cache */
      }
    })();
  }, [persistSavedBuckets, persistSettings]);

  const loadPage = useCallback(async (page, replace = false) => {
    const loadingSetter = replace ? setFeedLoading : setLoadingMore;
    loadingSetter(true);
    setFeedError(null);

    try {
      const data = await fetchPRs(page);
      const nextItems = Array.isArray(data.prs) ? data.prs : [];

      setPageMap((current) => (replace ? { [page]: nextItems } : { ...current, [page]: nextItems }));
      setLoadedPages((current) => (replace ? [page] : current.includes(page) ? current : [...current, page]));
      setHasMore(nextItems.length === PAGE_SIZE);
    } catch (error) {
      setFeedError(error.response?.data?.error || error.message);
    } finally {
      loadingSetter(false);
    }
  }, []);

  const refreshFeed = useCallback(() => loadPage(1, true), [loadPage]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    const nextPage = loadedPages.length > 0 ? Math.max(...loadedPages) + 1 : 1;
    return loadPage(nextPage, false);
  }, [hasMore, loadPage, loadedPages, loadingMore]);

  useEffect(() => {
    refreshFeed();
  }, [refreshFeed]);

  const getDetail = useCallback(
    async (prNumber) => {
      if (detailCache[prNumber]) return detailCache[prNumber];
      setDetailLoading((current) => ({ ...current, [prNumber]: true }));
      try {
        const detail = await fetchPRDetail(prNumber);
        setDetailCache((current) => ({ ...current, [prNumber]: detail }));
        return detail;
      } finally {
        setDetailLoading((current) => ({ ...current, [prNumber]: false }));
      }
    },
    [detailCache]
  );

  const refreshRouterStatus = useCallback(async () => {
    setRouterStatusLoading(true);
    try {
      const status = await fetchRouterStatus();
      setRouterStatus(status);
      return status;
    } catch {
      return null;
    } finally {
      setRouterStatusLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshRouterStatus();
  }, [refreshRouterStatus]);

  const summarize = useCallback(
    async (prNumber) => {
      setSummaryLoading((current) => ({ ...current, [prNumber]: true }));
      try {
        const summary = await summarizePRRequest(prNumber);
        setSummaryCache((current) => ({ ...current, [prNumber]: summary }));
        await refreshRouterStatus();
        return summary;
      } finally {
        setSummaryLoading((current) => ({ ...current, [prNumber]: false }));
      }
    },
    [refreshRouterStatus]
  );

  const isSaved = useCallback(
    (prNumber) => Boolean(savedBuckets.pr[String(prNumber)]),
    [savedBuckets.pr]
  );

  const isKbSaved = useCallback(
    (docId) => Boolean(savedBuckets.kb[String(docId)]),
    [savedBuckets.kb]
  );

  const isContributorSaved = useCallback(
    (login) => Boolean(savedBuckets.contributor[String(login)]),
    [savedBuckets.contributor]
  );

  const toggleSaved = useCallback(
    async (pr, detail, summary) => {
      const prNumber = detail?.pr?.number || pr?.number;
      if (!prNumber) return;

      const key = String(prNumber);
      const existing = savedBuckets.pr[key];

      if (existing) {
        const next = { ...savedBuckets, pr: { ...savedBuckets.pr } };
        delete next.pr[key];
        persistSavedBuckets(next);
        try {
          await deleteBookmark('pr', key);
        } catch {
          /* keep local state */
        }
        return;
      }

      let resolvedDetail = detail;
      if (!resolvedDetail) {
        resolvedDetail = detailCache[prNumber] || (await getDetail(prNumber).catch(() => null));
      }

      const record = makeSavedRecord(pr, resolvedDetail, summary || summaryCache[prNumber], existing);
      if (!record) return;

      const next = {
        ...savedBuckets,
        pr: { ...savedBuckets.pr, [key]: record },
      };
      persistSavedBuckets(next);
      try {
        await saveBookmark('pr', key, record);
      } catch {
        /* keep local state */
      }
    },
    [detailCache, getDetail, persistSavedBuckets, savedBuckets, summaryCache]
  );

  const toggleKbSaved = useCallback(
    async (doc) => {
      if (!doc?.id) return;
      const key = String(doc.id);
      const existing = savedBuckets.kb[key];

      if (existing) {
        const next = { ...savedBuckets, kb: { ...savedBuckets.kb } };
        delete next.kb[key];
        persistSavedBuckets(next);
        try {
          await deleteBookmark('kb', key);
        } catch {
          /* local */
        }
        return;
      }

      const record = {
        id: key,
        type: 'kb',
        savedAt: new Date().toISOString(),
        doc,
      };
      persistSavedBuckets({
        ...savedBuckets,
        kb: { ...savedBuckets.kb, [key]: record },
      });
      try {
        await saveBookmark('kb', key, record);
      } catch {
        /* local */
      }
    },
    [persistSavedBuckets, savedBuckets]
  );

  const toggleContributorSaved = useCallback(
    async (contributor) => {
      if (!contributor?.login) return;
      const key = String(contributor.login);
      const existing = savedBuckets.contributor[key];

      if (existing) {
        const next = { ...savedBuckets, contributor: { ...savedBuckets.contributor } };
        delete next.contributor[key];
        persistSavedBuckets(next);
        try {
          await deleteBookmark('contributor', key);
        } catch {
          /* local */
        }
        return;
      }

      const record = {
        id: key,
        type: 'contributor',
        savedAt: new Date().toISOString(),
        contributor: {
          login: contributor.login,
          avatar_url: contributor.avatar_url,
          html_url: contributor.html_url,
          contributions: contributor.contributions,
        },
      };
      persistSavedBuckets({
        ...savedBuckets,
        contributor: { ...savedBuckets.contributor, [key]: record },
      });
      try {
        await saveBookmark('contributor', key, record);
      } catch {
        /* local */
      }
    },
    [persistSavedBuckets, savedBuckets]
  );

  const saveSettings = useCallback(
    async (patch) => {
      const next = { ...settings, ...patch };
      persistSettings(next);
      try {
        const remote = await updateUserSettings(next);
        persistSettings({ ...DEFAULT_SETTINGS, ...remote });
        return remote;
      } catch {
        return next;
      }
    },
    [persistSettings, settings]
  );

  const savedList = useMemo(
    () =>
      Object.values(savedBuckets.pr).sort(
        (left, right) => new Date(right.savedAt).getTime() - new Date(left.savedAt).getTime()
      ),
    [savedBuckets.pr]
  );

  const savedKbList = useMemo(
    () =>
      Object.values(savedBuckets.kb).sort(
        (left, right) => new Date(right.savedAt).getTime() - new Date(left.savedAt).getTime()
      ),
    [savedBuckets.kb]
  );

  const savedContributorList = useMemo(
    () =>
      Object.values(savedBuckets.contributor).sort(
        (left, right) => new Date(right.savedAt).getTime() - new Date(left.savedAt).getTime()
      ),
    [savedBuckets.contributor]
  );

  const repository = useMemo(
    () => ({
      fullName: 'RocketChat/Rocket.Chat',
      provider: 'GitHub',
      branch: 'default',
      syncPolicy: 'Backend-driven',
    }),
    []
  );

  const value = useMemo(
    () => ({
      feedItems,
      feedError,
      feedLoading,
      hasMore,
      loadMore,
      loadingMore,
      refreshFeed,
      loadedPages,
      detailCache,
      detailLoading,
      getDetail,
      summaryCache,
      summaryLoading,
      summarize,
      routerStatus,
      routerStatusLoading,
      refreshRouterStatus,
      savedList,
      savedKbList,
      savedContributorList,
      savedBuckets,
      toggleSaved,
      toggleKbSaved,
      toggleContributorSaved,
      isSaved,
      isKbSaved,
      isContributorSaved,
      settings,
      saveSettings,
      repository,
    }),
    [
      detailCache,
      detailLoading,
      feedError,
      feedItems,
      feedLoading,
      getDetail,
      hasMore,
      isContributorSaved,
      isKbSaved,
      isSaved,
      loadMore,
      loadedPages,
      loadingMore,
      refreshFeed,
      refreshRouterStatus,
      repository,
      routerStatus,
      routerStatusLoading,
      saveSettings,
      savedContributorList,
      savedKbList,
      savedBuckets,
      savedList,
      settings,
      summarize,
      summaryCache,
      summaryLoading,
      toggleContributorSaved,
      toggleKbSaved,
      toggleSaved,
    ]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const value = useContext(AppDataContext);
  if (!value) {
    throw new Error('useAppData must be used inside AppDataProvider');
  }
  return value;
}
