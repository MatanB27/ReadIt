import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Article } from '../types/article';

const FEED_CACHE_KEY = 'feed_cache';
const BOOKMARKS_KEY = 'bookmarks';

const parseArticles = (value: string | null): Article[] => {
  if (!value) {
    return [];
  }

  try {
    return JSON.parse(value) as Article[];
  } catch {
    return [];
  }
};

export const saveCachedFeed = async (articles: Article[]): Promise<void> => {
  await AsyncStorage.setItem(FEED_CACHE_KEY, JSON.stringify(articles));
};

export const getCachedFeed = async (): Promise<Article[]> => {
  const value = await AsyncStorage.getItem(FEED_CACHE_KEY);

  return parseArticles(value);
};

export const saveBookmarks = async (articles: Article[]): Promise<void> => {
  await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(articles));
};

export const getBookmarks = async (): Promise<Article[]> => {
  const value = await AsyncStorage.getItem(BOOKMARKS_KEY);

  return parseArticles(value);
};
