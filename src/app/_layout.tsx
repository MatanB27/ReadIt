import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { ErrorBoundaryComponent } from '../components/ErrorBoundaryComponent';
import { useAuthBootstrap } from '../hooks/useAuthBootstrap';
import { DARK_THEME, LIGHT_THEME, useThemeStore } from '../store/themeStore';

export default function RootLayout() {
  const { isBootstrapping } = useAuthBootstrap();
  const [queryClient] = useState<QueryClient>(() => new QueryClient());
  const mode = useThemeStore((state) => state.mode);

  return (
    <SafeAreaProvider>
      {isBootstrapping ? (
        <SafeAreaView edges={['top', 'right', 'bottom', 'left']} style={styles.container}>
          <ActivityIndicator size="large" color="#1F1A17" />
        </SafeAreaView>
      ) : (
        <QueryClientProvider client={queryClient}>
          <ThemeProvider value={mode === DARK_THEME ? DarkTheme : DefaultTheme}>
            <ErrorBoundary FallbackComponent={ErrorBoundaryComponent}>
              <Stack>
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack>
              <StatusBar style={mode === DARK_THEME ? LIGHT_THEME : DARK_THEME} />
            </ErrorBoundary>
          </ThemeProvider>
        </QueryClientProvider>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4EFE6',
  },
});
