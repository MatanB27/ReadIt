import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams } from "expo-router";
import { format } from "date-fns";
import { WebView } from "react-native-webview";

import { FeedState } from "../../components/FeedState";
import { useAppTheme } from "../../hooks/useAppTheme";
import { getBookmarks, getCachedFeed } from "../../services/storage";
import { useBookmarksStore } from "../../store/bookmarksStore";
import { useSelectedArticleStore } from "../../store/selectedArticleStore";
import type { Article } from "../../types/article";
import { colors } from "../../theme/colors";

const findArticleById = (articles: Article[], id: number): Article | null => {
  const article = articles.find((item) => item.id === id);

  return article ?? null;
};

const SECONDS_TO_MILLISECONDS = 1000;
const MAX_HEADER_TITLE_LENGTH = 18;

const createThemedStyles = (
  theme: (typeof colors)["light"] | (typeof colors)["dark"],
  isBookmarked: boolean,
) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.background,
    },
    title: {
      color: theme.text,
    },
    metaBlock: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
    },
    meta: {
      color: theme.mutedText,
    },
    bookmarkButton: {
      backgroundColor: isBookmarked ? theme.primary : theme.secondarySurface,
    },
    bookmarkText: {
      color: isBookmarked ? theme.primaryText : theme.secondaryText,
    },
    webviewContainer: {
      borderColor: theme.border,
      backgroundColor: theme.surface,
    },
    fallbackBox: {
      borderColor: theme.border,
      backgroundColor: theme.surface,
    },
    fallbackText: {
      color: theme.mutedText,
    },
  });

export default function ArticleDetailScreen() {
  const theme = useAppTheme();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const articleId = !params.id || Array.isArray(params.id) ? 0 : Number(params.id);
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
    ? format(new Date(article.time * SECONDS_TO_MILLISECONDS), "MMM d, yyyy p")
    : "";
  const headerTitle =
    article.title.length > MAX_HEADER_TITLE_LENGTH
      ? `${article.title.slice(0, MAX_HEADER_TITLE_LENGTH)}...`
      : article.title;
  const themedStyles = createThemedStyles(theme.colors, isBookmarked);

  const handleToggleBookmark = async () => {
    await toggleBookmark(article);
  };

  return (
    <SafeAreaView edges={["top", "right", "bottom", "left"]} style={[styles.container, themedStyles.container]}>
      <Stack.Screen options={{ title: headerTitle }} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, themedStyles.title]}>{article.title}</Text>

        <View style={[styles.metaBlock, themedStyles.metaBlock]}>
          <Text style={[styles.meta, themedStyles.meta]}>
            Author: {article.author || "Unknown"}
          </Text>
          <Text style={[styles.meta, themedStyles.meta]}>Score: {article.score}</Text>
          <Text style={[styles.meta, themedStyles.meta]}>
            Date: {formattedDate || "Unknown"}
          </Text>
        </View>

        <Pressable onPress={handleToggleBookmark} style={[styles.bookmarkButton, themedStyles.bookmarkButton]}>
          <Text style={[styles.bookmarkText, themedStyles.bookmarkText]}>{isBookmarked ? "Saved" : "Save"}</Text>
        </Pressable>

        {article.url ? (
          <View style={[styles.webviewContainer, themedStyles.webviewContainer]}>
            <WebView
              nestedScrollEnabled
              source={{ uri: article.url }}
              style={styles.webview}
            />
          </View>
        ) : (
          <View style={[styles.fallbackBox, themedStyles.fallbackBox]}>
            <Text style={[styles.fallbackText, themedStyles.fallbackText]}>No article URL available</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  metaBlock: {
    gap: 8,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  meta: {
    fontSize: 15,
  },
  bookmarkButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  bookmarkText: {
    fontSize: 14,
    fontWeight: "600",
  },
  webviewContainer: {
    height: 720,
    overflow: "hidden",
    borderRadius: 18,
    borderWidth: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  fallbackBox: {
    padding: 24,
    borderRadius: 18,
    borderWidth: 1,
  },
  fallbackText: {
    fontSize: 15,
  },
});
