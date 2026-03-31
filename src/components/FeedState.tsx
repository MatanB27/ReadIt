import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme } from '../hooks/useAppTheme';
import { OfflineBanner } from './OfflineBanner';

type FeedStateProps = {
  title: string;
  message?: string;
  showOfflineBanner?: boolean;
};

export const FeedState = ({ title, message = '', showOfflineBanner = false }: FeedStateProps) => {
  const theme = useAppTheme();

  return (
    <SafeAreaView
      edges={['top', 'right', 'bottom', 'left']}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {showOfflineBanner ? <OfflineBanner /> : null}
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      {message ? <Text style={[styles.message, { color: theme.colors.mutedText }]}>{message}</Text> : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    marginBottom: 8,
    fontSize: 20,
    fontWeight: '600',
  },
  message: {
    textAlign: 'center',
    fontSize: 14,
  },
});
