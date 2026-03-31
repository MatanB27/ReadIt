import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Article } from '../types/article';
import { formatRelativeTime } from '../utils/formatRelativeTime';

type ArticleRowProps = {
  article: Article;
  bookmarked: boolean;
  onPress: (article: Article) => void;
  onToggleBookmark: (article: Article) => void;
};

const ArticleRowComponent = ({ article, bookmarked, onPress, onToggleBookmark }: ArticleRowProps) => {
  const metaText = `${article.score} points | ${article.commentCount} comments`;
  const detailText = `${article.domain || 'No domain'} | ${formatRelativeTime(article.time)}`;

  return (
    <Pressable
      onPress={() => {
        onPress(article);
      }}
      style={styles.row}
    >
      <View style={styles.rowContent}>
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.meta}>{metaText}</Text>
        <Text style={styles.meta}>{detailText}</Text>
      </View>

      <Pressable
        onPress={() => {
          onToggleBookmark(article);
        }}
        style={[styles.bookmarkButton, bookmarked && styles.bookmarkButtonActive]}
      >
        <Text style={[styles.bookmarkIcon, bookmarked && styles.bookmarkIconActive]}>
          {bookmarked ? '★' : '☆'}
        </Text>
        <Text style={[styles.bookmarkText, bookmarked && styles.bookmarkTextActive]}>
          {bookmarked ? 'Saved' : 'Save'}
        </Text>
      </Pressable>
    </Pressable>
  );
};

export const ArticleRow = memo(ArticleRowComponent);

const styles = StyleSheet.create({
  row: {
    marginBottom: 14,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2D7C8',
    backgroundColor: '#FFFDF9',
  },
  rowContent: {
    gap: 6,
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F1A17',
  },
  meta: {
    fontSize: 14,
    color: '#6A5F57',
  },
  bookmarkButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#EFE7DB',
  },
  bookmarkButtonActive: {
    backgroundColor: '#1F1A17',
  },
  bookmarkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3A302B',
  },
  bookmarkIcon: {
    fontSize: 14,
    color: '#3A302B',
  },
  bookmarkTextActive: {
    color: '#FFFFFF',
  },
  bookmarkIconActive: {
    color: '#FFFFFF',
  },
});
