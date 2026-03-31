import { ActivityIndicator, StyleSheet, View } from 'react-native';

export const FeedLoading = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#1F1A17" />
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
});
