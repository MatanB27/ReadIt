import { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import type { Article } from '../types/article';
import { fetchArticlesPage, fetchTopStoryIds } from '../api';
import { getCachedFeed, saveCachedFeed } from '../services/storage';
import { useNetworkStatus } from './useNetworkStatus';

const PAGE_SIZE = 20;

type UseFeedResult = {
  articles: Article[];
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  error: string;
  isConnected: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
};

export const useFeed = (): UseFeedResult => {
  const queryClient = useQueryClient();
  const isConnected = useNetworkStatus();
  const [articles, setArticles] = useState<Article[]>([]);
  const [topStoryIds, setTopStoryIds] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState('');

  const loadCachedFeed = useCallback(async () => {
    const cachedArticles = await getCachedFeed();
    setArticles(cachedArticles);
  }, []);

  const fetchIds = useCallback(async () => {
    return queryClient.fetchQuery({
      queryKey: ['top-story-ids'],
      queryFn: fetchTopStoryIds,
    });
  }, [queryClient]);

  const fetchPage = useCallback(
    async (ids: number[], nextPage: number) => {
      return queryClient.fetchQuery({
        queryKey: ['articles-page', nextPage, PAGE_SIZE],
        queryFn: () => fetchArticlesPage(ids, nextPage, PAGE_SIZE),
      });
    },
    [queryClient]
  );

  const loadInitialFeed = useCallback(async () => {
    setError('');
    setIsLoading(true);

    const cachedArticles = await getCachedFeed();
    const hasCachedArticles = cachedArticles.length > 0;

    if (hasCachedArticles) {
      setArticles(cachedArticles);
      setIsLoading(false);
    }

    if (!isConnected) {
      setPage(1);
      if (!hasCachedArticles) {
        setArticles(cachedArticles);
        setIsLoading(false);
      }
      setIsLoading(false);
      return;
    }

    try {
      const ids = await fetchIds();
      const firstPageArticles = await fetchPage(ids, 1);

      setTopStoryIds(ids);
      setArticles(firstPageArticles);
      setPage(1);
      await saveCachedFeed(firstPageArticles);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load feed');
    } finally {
      setIsLoading(false);
    }
  }, [fetchIds, fetchPage, isConnected]);

  const loadMore = useCallback(async () => {
    if (!isConnected || isLoadingMore || topStoryIds.length === 0) {
      return;
    }

    const nextPage = page + 1;
    const start = (nextPage - 1) * PAGE_SIZE;

    if (start >= topStoryIds.length) {
      return;
    }

    setIsLoadingMore(true);
    setError('');

    try {
      const nextPageArticles = await fetchPage(topStoryIds, nextPage);
      const nextArticles = [...articles, ...nextPageArticles];

      setArticles(nextArticles);
      setPage(nextPage);
      await saveCachedFeed(nextArticles);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load more articles');
    } finally {
      setIsLoadingMore(false);
    }
  }, [articles, fetchPage, isConnected, isLoadingMore, page, topStoryIds]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    setError('');

    if (!isConnected) {
      await loadCachedFeed();
      setIsRefreshing(false);
      return;
    }

    try {
      const ids = await fetchIds();
      const firstPageArticles = await fetchPage(ids, 1);

      setTopStoryIds(ids);
      setArticles(firstPageArticles);
      setPage(1);
      await saveCachedFeed(firstPageArticles);
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : 'Failed to refresh feed');
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchIds, fetchPage, isConnected, loadCachedFeed]);

  useEffect(() => {
    const initializeFeed = async () => {
      await loadInitialFeed();
    };

    initializeFeed();
  }, [loadInitialFeed]);

  return {
    articles,
    isLoading,
    isRefreshing,
    isLoadingMore,
    error,
    isConnected,
    loadMore,
    refresh,
  };
};
