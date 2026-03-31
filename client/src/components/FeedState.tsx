import { StyleSheet, Text, View } from 'react-native';

import { OfflineBanner } from './OfflineBanner';

type FeedStateProps = {
  title: string;
  message?: string;
  showOfflineBanner?: boolean;
};

export const FeedState = ({ title, message = '', showOfflineBanner = false }: FeedStateProps) => {
  return (
    <View style={styles.container}>
      {showOfflineBanner ? <OfflineBanner /> : null}
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F5EFE6',
  },
  title: {
    marginBottom: 8,
    fontSize: 20,
    fontWeight: '600',
    color: '#1F1A17',
  },
  message: {
    textAlign: 'center',
    fontSize: 14,
    color: '#6A5F57',
  },
});
