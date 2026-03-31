import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Header } from './Header';
import { SkeletonRow } from './SkeletonRow';

export const FeedLoading = () => {
  return (
    <SafeAreaView edges={['top', 'right', 'bottom', 'left']} style={styles.container}>
      <Header onLogout={() => {}} />
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
    backgroundColor: '#F5EFE6',
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  list: {
    paddingBottom: 24,
  },
});
