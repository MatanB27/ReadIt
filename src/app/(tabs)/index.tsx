import { useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Article } from '../../types/article';
import { ArticleRow } from '../../components/ArticleRow';
import { FeedLoading } from '../../components/FeedLoading';
import { FeedState } from '../../components/FeedState';
import { Header } from '../../components/Header';
import { OfflineBanner } from '../../components/OfflineBanner';
import { useFeed } from '../../hooks/useFeed';
import { useAuthStore } from '../../store/authStore';
import { useBookmarksStore } from '../../store/bookmarksStore';
import { useSelectedArticleStore } from '../../store/selectedArticleStore';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useThemeStore } from '../../store/themeStore';

export default function FeedScreen() {
  const { articles, error, isConnected, isLoading, isLoadingMore, isRefreshing, loadMore, refresh } =
    useFeed();
    
  const logout = useAuthStore((state) => state.logout);
  const bookmarks = useBookmarksStore((state) => state.bookmarks);
  const hydrateBookmarks = useBookmarksStore((state) => state.hydrateBookmarks);
  const toggleBookmark = useBookmarksStore((state) => state.toggleBookmark);
  const setSelectedArticle = useSelectedArticleStore((state) => state.setSelectedArticle);
  const mode = useThemeStore((state) => state.mode);
  const toggleMode = useThemeStore((state) => state.toggleMode);
  const theme = useAppTheme();

  useEffect(() => {
    const loadBookmarks = async () => {
      await hydrateBookmarks();
    };

    loadBookmarks();
  }, [hydrateBookmarks]);

  const handleToggleBookmark = useCallback(async (article: Article) => {
    await toggleBookmark(article);
  }, [toggleBookmark]);

  const handlePressArticle = useCallback((article: Article) => {
    setSelectedArticle(article);
    router.push({
      pathname: '/article/[id]',
      params: {
        id: article.id.toString(),
      },
    });
  }, [setSelectedArticle]);

  const handleLoadMore = useCallback(async () => {
    await loadMore();
  }, [loadMore]);

  const handleRefresh = useCallback(async () => {
    await refresh();
  }, [refresh]);

  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  const renderItem = ({ item }: { item: Article }) => {
    return (
      <ArticleRow
        article={item}
        bookmarked={Boolean(bookmarks[item.id])}
        onPress={handlePressArticle}
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
    <SafeAreaView edges={['top', 'right', 'left']} style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Feed" mode={mode} onToggleTheme={toggleMode} onLogout={handleLogout} />

      {!isConnected ? <OfflineBanner /> : null}
      {error ? <Text style={[styles.inlineError, { color: theme.colors.error }]}>{error}</Text> : null}

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
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
