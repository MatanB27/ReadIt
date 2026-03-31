import { Pressable, StyleSheet, Text, View } from 'react-native';

type HeaderProps = {
  onLogout: () => void;
};

export const Header = ({ onLogout }: HeaderProps) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Feed</Text>
      <Pressable onPress={onLogout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F1A17',
  },
  logoutButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#1F1A17',
  },
  logoutButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
