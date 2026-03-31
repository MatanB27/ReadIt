import { useQuery } from '@tanstack/react-query';
import { fetchArticlesPage } from '../api';

const USE_GET_ARTICLE_PAGE_KEY = 'getArticlePageKey'

export const useArticlesPage = (ids: number[], page: number, pageSize: number) => {
  return useQuery({
    queryKey: [USE_GET_ARTICLE_PAGE_KEY, ids, page, pageSize],
    queryFn: () => fetchArticlesPage(ids, page, pageSize),
    enabled: ids.length > 0,
  });
};
