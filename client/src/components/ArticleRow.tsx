import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Article } from '../types/article';
import { formatRelativeTime } from '../utils/formatRelativeTime';

type ArticleRowProps = {
  article: Article;
  isBookmarked: boolean;
  onToggleBookmark: (article: Article) => void;
};

export const ArticleRow = ({ article, isBookmarked, onToggleBookmark }: ArticleRowProps) => {
  return (
    <View style={styles.row}>
      <View style={styles.rowContent}>
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.meta}>
          {article.score} points | {article.commentCount} comments
        </Text>
        <Text style={styles.meta}>
          {article.domain || 'No domain'} | {formatRelativeTime(article.time)}
        </Text>
      </View>

      <Pressable
        onPress={() => {
          onToggleBookmark(article);
        }}
        style={[styles.bookmarkButton, isBookmarked && styles.bookmarkButtonActive]}
      >
        <Text style={[styles.bookmarkText, isBookmarked && styles.bookmarkTextActive]}>
          {isBookmarked ? 'Saved' : 'Save'}
        </Text>
      </Pressable>
    </View>
  );
};

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
  bookmarkTextActive: {
    color: '#FFFFFF',
  },
});
