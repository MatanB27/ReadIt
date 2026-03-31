import { StyleSheet, Text } from 'react-native';

export const OfflineBanner = () => {
  return <Text style={styles.banner}>Offline mode</Text>;
};

const styles = StyleSheet.create({
  banner: {
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#F2C94C',
    fontSize: 13,
    fontWeight: '600',
    color: '#3F2D00',
    alignSelf: 'flex-start',
  },
});
