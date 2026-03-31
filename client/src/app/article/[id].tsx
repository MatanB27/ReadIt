import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams } from "expo-router";
import { format } from "date-fns";
import { WebView } from "react-native-webview";

import type { Article } from "../../types/article";
import { FeedState } from "../../components/FeedState";
import { getBookmarks, getCachedFeed } from "../../services/storage";
import { useBookmarksStore } from "../../store/bookmarksStore";
import { useSelectedArticleStore } from "../../store/selectedArticleStore";

const findArticleById = (articles: Article[], id: number): Article | null => {
  const article = articles.find((item) => item.id === id);

  return article ?? null;
};

export default function ArticleDetailScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const articleId =
    !params.id || Array.isArray(params.id) ? 0 : Number(params.id);
  const selectedArticle = useSelectedArticleStore(
    (state) => state.selectedArticle,
  );
  const toggleBookmark = useBookmarksStore((state) => state.toggleBookmark);
  const bookmarks = useBookmarksStore((state) => state.bookmarks);
  const [article, setArticle] = useState<Article | null>(
    selectedArticle && selectedArticle.id === articleId
      ? selectedArticle
      : null,
  );
  const [isLoading, setIsLoading] = useState(!article);

  useEffect(() => {
    if (selectedArticle && selectedArticle.id === articleId) {
      setArticle(selectedArticle);
      setIsLoading(false);
      return;
    }

    const loadArticle = async () => {
      const cachedFeed = await getCachedFeed();
      const cachedArticle = findArticleById(cachedFeed, articleId);

      if (cachedArticle) {
        setArticle(cachedArticle);
        setIsLoading(false);
        return;
      }

      const bookmarkArticles = await getBookmarks();
      const bookmarkedArticle = findArticleById(bookmarkArticles, articleId);

      setArticle(bookmarkedArticle);
      setIsLoading(false);
    };

    loadArticle();
  }, [articleId, selectedArticle]);

  if (isLoading) {
    return <FeedState title="Loading article" />;
  }

  if (!article) {
    return (
      <FeedState
        title="Article unavailable"
        message="Unable to open this article."
      />
    );
  }

  const isBookmarked = Boolean(bookmarks[article.id]);
  const formattedDate = article.time
    ? format(new Date(article.time * 1000), "MMM d, yyyy p")
    : "";
  const headerTitle =
    article.title.length > 36
      ? `${article.title.slice(0, 36)}...`
      : article.title;

  const handleToggleBookmark = async () => {
    await toggleBookmark(article);
  };

  return (
    <SafeAreaView
      edges={["top", "right", "bottom", "left"]}
      style={styles.container}
    >
      <Stack.Screen options={{ title: headerTitle }} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{article.title}</Text>

        <View style={styles.metaBlock}>
          <Text style={styles.meta}>Author: {article.author || "Unknown"}</Text>
          <Text style={styles.meta}>Score: {article.score}</Text>
          <Text style={styles.meta}>Date: {formattedDate || "Unknown"}</Text>
        </View>

        <Pressable
          onPress={handleToggleBookmark}
          style={[
            styles.bookmarkButton,
            isBookmarked && styles.bookmarkButtonActive,
          ]}
        >
          <Text
            style={[
              styles.bookmarkText,
              isBookmarked && styles.bookmarkTextActive,
            ]}
          >
            {isBookmarked ? "Saved" : "Save"}
          </Text>
        </Pressable>

        {article.url ? (
          <View style={styles.webviewContainer}>
            <WebView
              nestedScrollEnabled
              source={{ uri: article.url }}
              style={styles.webview}
            />
          </View>
        ) : (
          <View style={styles.fallbackBox}>
            <Text style={styles.fallbackText}>No article URL available</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EFE6",
  },
  content: {
    padding: 24,
    gap: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F1A17",
  },
  metaBlock: {
    gap: 8,
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#FFFDF9",
    borderWidth: 1,
    borderColor: "#E2D7C8",
  },
  meta: {
    fontSize: 15,
    color: "#4B413C",
  },
  bookmarkButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#EFE7DB",
  },
  bookmarkButtonActive: {
    backgroundColor: "#1F1A17",
  },
  bookmarkText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3A302B",
  },
  bookmarkTextActive: {
    color: "#FFFFFF",
  },
  webviewContainer: {
    height: 720,
    overflow: "hidden",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2D7C8",
    backgroundColor: "#FFFFFF",
  },
  webview: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  fallbackBox: {
    padding: 24,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2D7C8",
    backgroundColor: "#FFFDF9",
  },
  fallbackText: {
    fontSize: 15,
    color: "#4B413C",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 8,
  },
  footerText: {
    fontSize: 13,
    color: "#6A5F57",
  },
});
