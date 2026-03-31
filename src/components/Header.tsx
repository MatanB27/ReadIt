import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

import { useAppTheme } from "../hooks/useAppTheme";
import { DARK_THEME, LIGHT_THEME } from "../store/themeStore";

type HeaderProps = {
  title: string;
  mode: "light" | "dark";
  onToggleTheme: () => void;
  onLogout: () => void;
};

export const Header = ({
  title,
  mode,
  onToggleTheme,
  onLogout,
}: HeaderProps) => {
  const theme = useAppTheme();

  return (
    <View style={styles.header}>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      <View style={styles.actions}>
        <View style={styles.themeToggle}>
          <Text style={[styles.themeLabel, { color: theme.colors.mutedText }]}>
            {mode === DARK_THEME ? DARK_THEME : LIGHT_THEME}
          </Text>
          <Switch
            onValueChange={onToggleTheme}
            thumbColor={theme.colors.switchThumb}
            trackColor={{
              false: theme.colors.switchTrack,
              true: theme.colors.primary,
            }}
            value={mode === DARK_THEME}
          />
        </View>
        <Pressable
          onPress={onLogout}
          style={[
            styles.logoutButton,
            { backgroundColor: theme.colors.primary },
          ]}
        >
          <Text
            style={[
              styles.logoutButtonText,
              { color: theme.colors.primaryText },
            ]}
          >
            Logout
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  themeToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  themeLabel: {
    fontSize: 13,
    fontWeight: "600",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  logoutButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  logoutButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
