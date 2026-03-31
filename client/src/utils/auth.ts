import type { AuthTokenPayload } from '../types/auth';

export const decodeMockToken = (token: string): AuthTokenPayload | null => {
  if (!token) {
    return null;
  }

  const decoded = globalThis.atob(token);
  const payload = JSON.parse(decoded) as AuthTokenPayload;

  return payload;
};

export const isTokenExpired = (token: string): boolean => {
  const payload = decodeMockToken(token);

  if (!payload) {
    return true;
  }

  return Date.now() >= payload.exp;
};
