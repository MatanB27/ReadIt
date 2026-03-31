import { create } from 'zustand';

import type { Article } from '../types/article';

type SelectedArticleStore = {
  selectedArticle: Article | null;
  setSelectedArticle: (article: Article) => void;
  clearSelectedArticle: () => void;
};

export const useSelectedArticleStore = create<SelectedArticleStore>((set) => ({
  selectedArticle: null,
  setSelectedArticle: (article) => {
    set({ selectedArticle: article });
  },
  clearSelectedArticle: () => {
    set({ selectedArticle: null });
  },
}));
