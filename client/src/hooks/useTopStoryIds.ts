import { useQuery } from '@tanstack/react-query';
import { fetchTopStoryIds } from '../api';

const USE_GET_TOP_STORY_IDS_KEY = 'getTopStoryIdsKey'

export const useTopStoryIds = () => {
  return useQuery({
    queryKey: [USE_GET_TOP_STORY_IDS_KEY],
    queryFn: fetchTopStoryIds,
  });
};
