import type { AuthTokenPayload } from '../types/auth';
import { decodeMockToken, isTokenExpired } from '../utils/auth';
import { deleteToken, getToken, saveToken } from './secureStore';

export const VALID_EMAIL = 'user@readit.dev';
export const VALID_PASSWORD = 'password123';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

const encodeMockToken = (payload: AuthTokenPayload): string => {
  return globalThis.btoa(JSON.stringify(payload));
};

export const login = async (
  email: string,
  password: string
): Promise<{ success: boolean; error: string | null; token: string | null }> => {
  if (email !== VALID_EMAIL || password !== VALID_PASSWORD) {
    return {
      success: false,
      error: 'Invalid credentials',
      token: null,
    };
  }

  const now = Date.now();
  const token = encodeMockToken({
    sub: email,
    iat: now,
    exp: now + SESSION_DURATION_MS,
  });

  await saveToken(token);

  return {
    success: true,
    error: null,
    token,
  };
};

export const getValidSession = async (): Promise<{
  token: string | null;
  payload: AuthTokenPayload | null;
}> => {
  const token = await getToken();

  if (!token || isTokenExpired(token)) {
    await deleteToken();

    return {
      token: null,
      payload: null,
    };
  }

  return {
    token,
    payload: decodeMockToken(token),
  };
};

export const logout = async (): Promise<void> => {
  await deleteToken();
};
