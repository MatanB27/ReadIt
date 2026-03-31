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
import { router } from 'expo-router';

import { VALID_EMAIL, VALID_PASSWORD } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';

export default function LoginScreen() {
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState(VALID_EMAIL);
  const [password, setPassword] = useState(VALID_PASSWORD);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardView}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>ReadIt</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="#7A7A7A"
            style={styles.input}
            value={email}
          />

          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#7A7A7A"
            secureTextEntry
            style={styles.input}
            value={password}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            disabled={isDisabled}
            onPress={() => {
              void handleLogin();
            }}
            style={[styles.button, isDisabled && styles.buttonDisabled]}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Log In</Text>
            )}
          </Pressable>
        </View>
      </View>
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
    backgroundColor: '#F4EFE6',
  },
  card: {
    padding: 24,
    borderRadius: 24,
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: '#E6DED1',
    gap: 14,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F1A17',
  },
  subtitle: {
    marginBottom: 8,
    fontSize: 16,
    color: '#6A5F57',
  },
  input: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D8CCBC',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#1F1A17',
  },
  error: {
    fontSize: 14,
    color: '#B42318',
  },
  button: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F1A17',
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
