import { act, renderHook } from '@testing-library/react-native';

import { getBookmarks, saveBookmarks } from '../services/storage';
import type { Article } from '../types/article';
import { useBookmarksStore } from './bookmarksStore';

jest.mock('../services/storage', () => ({
  getBookmarks: jest.fn(),
  saveBookmarks: jest.fn(),
}));

const mockedGetBookmarks = jest.mocked(getBookmarks);
const mockedSaveBookmarks = jest.mocked(saveBookmarks);

const article: Article = {
  id: 1,
  title: 'Test story',
  author: 'alice',
  score: 42,
  commentCount: 10,
  time: 1710000000,
  url: 'https://example.com/story',
  domain: 'example.com',
};

describe('useBookmarksStore', () => {
  beforeEach(() => {
    useBookmarksStore.setState({ bookmarks: {} });
    mockedGetBookmarks.mockReset();
    mockedSaveBookmarks.mockReset();
  });

  it('hydrates bookmarks and persists toggle changes', async () => {
    mockedGetBookmarks.mockResolvedValue([article]);
    mockedSaveBookmarks.mockResolvedValue(undefined);

    const { result } = renderHook(() => useBookmarksStore());

    await act(async () => {
      await result.current.hydrateBookmarks();
    });

    expect(result.current.bookmarks[article.id]).toEqual(article);
    expect(result.current.isBookmarked(article.id)).toBe(true);

    await act(async () => {
      await result.current.toggleBookmark(article);
    });

    expect(result.current.isBookmarked(article.id)).toBe(false);
    expect(mockedSaveBookmarks).toHaveBeenLastCalledWith([]);

    await act(async () => {
      await result.current.toggleBookmark(article);
    });

    expect(result.current.bookmarks[article.id]).toEqual(article);
    expect(mockedSaveBookmarks).toHaveBeenLastCalledWith([article]);
  });
});
