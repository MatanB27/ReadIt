import axios from 'axios';

import type { Article, HNItem } from './types/article';
import { extractDomain } from './utils/extractDomain';

const hackerNewsApi = axios.create({
  baseURL: 'https://hacker-news.firebaseio.com/v0',
});

export const mapHNItemToArticle = (item: HNItem): Article | null => {
  if (!item.id || !item.title) {
    return null;
  }

  return {
    id: item.id,
    title: item.title,
    author: item.by ?? '',
    score: item.score ?? 0,
    commentCount: item.descendants ?? 0,
    time: item.time ?? 0,
    url: item.url ?? null,
    domain: extractDomain(item.url),
  };
};

export const fetchTopStoryIds = async (): Promise<number[]> => {
  const { data } = await hackerNewsApi.get<number[]>('/topstories.json');

  return data;
};

export const fetchItemById = async (id: number): Promise<HNItem | null> => {
  const { data } = await hackerNewsApi.get<HNItem | null>(`/item/${id}.json`);

  return data;
};

export const fetchArticlesPage = async (
  ids: number[],
  page: number,
  pageSize: number
): Promise<Article[]> => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageIds = ids.slice(start, end);

  const items = await Promise.all(
    pageIds.map((id) =>
      fetchItemById(id).catch(() => null)
    )
  );

  return items.reduce<Article[]>((articles, item) => {
    if (!item) {
      return articles;
    }

    const article = mapHNItemToArticle(item);

    if (article) {
      articles.push(article);
    }

    return articles;
  }, []);
};
