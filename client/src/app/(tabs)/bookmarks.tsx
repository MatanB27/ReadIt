import { useCallback, useEffect, useMemo } from "react";
import { FlatList, StyleSheet } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import type { Article } from "../../types/article";
import { ArticleRow } from "../../components/ArticleRow";
import { FeedState } from "../../components/FeedState";
import { Header } from "../../components/Header";
import { useAuthStore } from "../../store/authStore";
import { useBookmarksStore } from "../../store/bookmarksStore";
import { useSelectedArticleStore } from "../../store/selectedArticleStore";

export default function BookmarksScreen() {
  const logout = useAuthStore((state) => state.logout);
  const bookmarks = useBookmarksStore((state) => state.bookmarks);
  const hydrateBookmarks = useBookmarksStore((state) => state.hydrateBookmarks);
  const toggleBookmark = useBookmarksStore((state) => state.toggleBookmark);
  const setSelectedArticle = useSelectedArticleStore(
    (state) => state.setSelectedArticle,
  );

  useEffect(() => {
    const loadBookmarks = async () => {
      await hydrateBookmarks();
    };

    loadBookmarks();
  }, [hydrateBookmarks]);

  const bookmarkedArticles = useMemo(() => {
    return Object.values(bookmarks);
  }, [bookmarks]);

  const handleToggleBookmark = useCallback(
    async (article: Article) => {
      await toggleBookmark(article);
    },
    [toggleBookmark],
  );

  const handlePressArticle = useCallback(
    (article: Article) => {
      setSelectedArticle(article);
      router.push({
        pathname: "/article/[id]",
        params: {
          id: article.id,
        },
      });
    },
    [setSelectedArticle],
  );

  const content = !bookmarkedArticles.length ? (
    <FeedState
      title="No bookmarked articles yet"
      message="Bookmark stories from the feed to keep them here."
    />
  ) : (
    <FlatList
      contentContainerStyle={styles.listContent}
      data={bookmarkedArticles}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ArticleRow
          article={item}
          bookmarked
          onPress={handlePressArticle}
          onToggleBookmark={handleToggleBookmark}
        />
      )}
    />
  );

  return (
    <SafeAreaView edges={["top", "right", "left"]} style={styles.container}>
      <Header title="Bookmarks" onLogout={logout} />
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EFE6",
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  listContent: {
    paddingBottom: 24,
  },
});
