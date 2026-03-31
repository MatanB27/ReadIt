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
  const themedStyles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
    },
    title: {
      color: theme.colors.text,
    },
    message: {
      color: theme.colors.mutedText,
    },
  });

  return (
    <SafeAreaView edges={['top', 'right', 'bottom', 'left']} style={[styles.container, themedStyles.container]}>
      {showOfflineBanner ? <OfflineBanner /> : null}
      <Text style={[styles.title, themedStyles.title]}>{title}</Text>
      {message ? <Text style={[styles.message, themedStyles.message]}>{message}</Text> : null}
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
