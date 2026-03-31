import { create } from 'zustand';

import type { Article } from '../types/article';
import { getBookmarks, saveBookmarks } from '../services/storage';

type BookmarksById = Record<number, Article>;

type BookmarksStore = {
  bookmarks: BookmarksById;
  hydrateBookmarks: () => Promise<void>;
  toggleBookmark: (article: Article) => Promise<void>;
  removeBookmark: (id: number) => Promise<void>;
  isBookmarked: (id: number) => boolean;
};

const mapArticlesToRecord = (articles: Article[]): BookmarksById => {
  return articles.reduce<BookmarksById>((result, article) => {
    result[article.id] = article;
    return result;
  }, {});
};

export const useBookmarksStore = create<BookmarksStore>((set, get) => ({
  bookmarks: {},

  hydrateBookmarks: async () => {
    const articles = await getBookmarks();

    set({
      bookmarks: mapArticlesToRecord(articles),
    });
  },

  toggleBookmark: async (article) => {
    const currentBookmarks = get().bookmarks;
    const nextBookmarks = { ...currentBookmarks };

    if (nextBookmarks[article.id]) {
      delete nextBookmarks[article.id];
    } else {
      nextBookmarks[article.id] = article;
    }

    set({ bookmarks: nextBookmarks });
    await saveBookmarks(Object.values(nextBookmarks));
  },

  removeBookmark: async (id) => {
    const currentBookmarks = get().bookmarks;

    if (!currentBookmarks[id]) {
      return;
    }

    const nextBookmarks = { ...currentBookmarks };
    delete nextBookmarks[id];

    set({ bookmarks: nextBookmarks });
    await saveBookmarks(Object.values(nextBookmarks));
  },

  isBookmarked: (id) => {
    return Boolean(get().bookmarks[id]);
  },
}));
