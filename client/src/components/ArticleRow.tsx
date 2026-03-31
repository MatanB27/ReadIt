import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useAppTheme } from '../hooks/useAppTheme';
import type { Article } from '../types/article';
import { formatRelativeTime } from '../utils/formatRelativeTime';

type ArticleRowProps = {
  article: Article;
  bookmarked: boolean;
  onPress: (article: Article) => void;
  onToggleBookmark: (article: Article) => void;
};

const ArticleRowComponent = ({ article, bookmarked, onPress, onToggleBookmark }: ArticleRowProps) => {
  const theme = useAppTheme();
  const metaText = `${article.score} points | ${article.commentCount} comments`;
  const detailText = `${article.domain || 'No domain'} | ${formatRelativeTime(article.time)}`;

  return (
    <Animated.View entering={FadeInDown.duration(250)}>
      <Pressable
        onPress={() => {
          onPress(article);
        }}
        style={[styles.row, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}
      >
        <View style={styles.rowContent}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{article.title}</Text>
          <Text style={[styles.meta, { color: theme.colors.mutedText }]}>{metaText}</Text>
          <Text style={[styles.meta, { color: theme.colors.mutedText }]}>{detailText}</Text>
        </View>

        <Pressable
          onPress={() => {
            onToggleBookmark(article);
          }}
          style={[
            styles.bookmarkButton,
            { backgroundColor: bookmarked ? theme.colors.primary : theme.colors.secondarySurface },
          ]}
        >
          <Text
            style={[
              styles.bookmarkText,
              { color: bookmarked ? theme.colors.primaryText : theme.colors.secondaryText },
            ]}
          >
            {bookmarked ? 'Saved' : 'Save'}
          </Text>
        </Pressable>
      </Pressable>
    </Animated.View>
  );
};

export const ArticleRow = memo(ArticleRowComponent);

const styles = StyleSheet.create({
  row: {
    marginBottom: 14,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  rowContent: {
    gap: 6,
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  meta: {
    fontSize: 14,
  },
  bookmarkButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  bookmarkText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
