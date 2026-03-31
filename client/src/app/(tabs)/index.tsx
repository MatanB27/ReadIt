import { useEffect } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import type { Article } from '../../types/article';
import { ArticleRow } from '../../components/ArticleRow';
import { FeedLoading } from '../../components/FeedLoading';
import { FeedState } from '../../components/FeedState';
import { OfflineBanner } from '../../components/OfflineBanner';
import { useFeed } from '../../hooks/useFeed';
import { useBookmarksStore } from '../../store/bookmarksStore';

export default function FeedScreen() {
  const { articles, error, isConnected, isLoading, isLoadingMore, isRefreshing, loadMore, refresh } =
    useFeed();
  const bookmarks = useBookmarksStore((state) => state.bookmarks);
  const hydrateBookmarks = useBookmarksStore((state) => state.hydrateBookmarks);
  const toggleBookmark = useBookmarksStore((state) => state.toggleBookmark);

  useEffect(() => {
    const loadBookmarks = async () => {
      await hydrateBookmarks();
    };

    loadBookmarks();
  }, [hydrateBookmarks]);

  const handleToggleBookmark = async (article: Article) => {
    await toggleBookmark(article);
  };

  const handleLoadMore = async () => {
    await loadMore();
  };

  const handleRefresh = async () => {
    await refresh();
  };

  const renderItem = ({ item }: { item: Article }) => {
    return (
      <ArticleRow
        article={item}
        isBookmarked={Boolean(bookmarks[item.id])}
        onToggleBookmark={handleToggleBookmark}
      />
    );
  };

  if (isLoading) {
    return <FeedLoading />;
  }

  if (!articles.length && error) {
    return <FeedState title="Unable to load feed" message={error} showOfflineBanner={!isConnected} />;
  }

  if (!articles.length) {
    return <FeedState title="No articles yet" showOfflineBanner={!isConnected} />;
  }

  return (
    <View style={styles.container}>
      {!isConnected ? <OfflineBanner /> : null}
      {error ? <Text style={styles.inlineError}>{error}</Text> : null}

      <FlatList
        contentContainerStyle={styles.listContent}
        data={articles}
        keyExtractor={item => item.id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
        renderItem={renderItem}
        ListFooterComponent={
          isLoadingMore ? (
            <View style={styles.footer}>
              <ActivityIndicator color="#1F1A17" />
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EFE6',
    paddingTop: 24,
    paddingHorizontal: 24,
  },
  listContent: {
    paddingBottom: 24,
  },
  inlineError: {
    marginBottom: 12,
    fontSize: 14,
    color: '#B42318',
  },
  footer: {
    paddingVertical: 16,
  },
});
