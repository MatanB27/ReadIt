import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme } from '../../hooks/useAppTheme';
import { VALID_EMAIL, VALID_PASSWORD } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';

export default function LoginScreen() {
  const theme = useAppTheme();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState<string>(VALID_EMAIL);
  const [password, setPassword] = useState<string>(VALID_PASSWORD);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const isDisabled = !email.trim() || !password.trim() || isSubmitting;

  const handleLogin = async () => {
    if (isDisabled) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    const result = await login(email.trim(), password);

    if (!result.success) {
      setError(result.error ?? 'Login failed');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardView}
    >
      <SafeAreaView edges={['top', 'right', 'bottom', 'left']} style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.title, { color: theme.colors.text }]}>ReadIt</Text>
          <Text style={[styles.subtitle, { color: theme.colors.mutedText }]}>Sign in to continue</Text>

          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={theme.colors.mutedText}
            style={[styles.input, { borderColor: theme.colors.inputBorder, backgroundColor: theme.colors.inputBackground, color: theme.colors.text }]}
            value={email}
          />

          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={theme.colors.mutedText}
            secureTextEntry
            style={[styles.input, { borderColor: theme.colors.inputBorder, backgroundColor: theme.colors.inputBackground, color: theme.colors.text }]}
            value={password}
          />

          {error ? <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text> : null}

          <Pressable
            disabled={isDisabled}
            onPress={handleLogin}
            style={[styles.button, { backgroundColor: theme.colors.primary }, isDisabled && styles.buttonDisabled]}
          >
            {isSubmitting ? (
              <ActivityIndicator color={theme.colors.primaryText} />
            ) : (
              <Text style={[styles.buttonText, { color: theme.colors.primaryText }]}>Log In</Text>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    gap: 14,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  error: {
    fontSize: 14,
  },
  button: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
