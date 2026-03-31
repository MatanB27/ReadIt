import { StyleSheet, Text } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';

export const OfflineBanner = () => {
  const theme = useAppTheme();
  const themedStyles = StyleSheet.create({
    banner: {
      backgroundColor: theme.colors.warningBackground,
      color: theme.colors.warningText,
    },
  });

  return <Text style={[styles.banner, themedStyles.banner]}>Offline mode</Text>;
};

const styles = StyleSheet.create({
  banner: {
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    fontSize: 13,
    fontWeight: '600',
    alignSelf: 'flex-start',
  },
});
