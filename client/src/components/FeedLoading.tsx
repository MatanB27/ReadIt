import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme } from '../hooks/useAppTheme';
import { Header } from './Header';
import { SkeletonRow } from './SkeletonRow';

export const FeedLoading = () => {
  const theme = useAppTheme();

  return (
    <SafeAreaView
      edges={['top', 'right', 'bottom', 'left']}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header title="Feed" mode={theme.mode} onToggleTheme={() => {}} onLogout={() => {}} />
      <View style={styles.list}>
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  list: {
    paddingBottom: 24,
  },
});
