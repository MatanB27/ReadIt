import { create } from 'zustand';

import { getValidSession, login as loginService, logout as logoutService } from '../services/authService';

type AuthStore = {
  token: string | null;
  userEmail: string;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  bootstrapAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  userEmail: '',
  isAuthenticated: false,
  isBootstrapping: true,

  bootstrapAuth: async () => {
    set({ isBootstrapping: true });

    const session = await getValidSession();

    if (!session.token || !session.payload) {
      set({
        token: null,
        userEmail: '',
        isAuthenticated: false,
        isBootstrapping: false,
      });

      return;
    }

    set({
      token: session.token,
      userEmail: session.payload.sub,
      isAuthenticated: true,
      isBootstrapping: false,
    });
  },

  login: async (email, password) => {
    const result = await loginService(email, password);

    if (!result.success || !result.token) {
      set({
        token: null,
        userEmail: '',
        isAuthenticated: false,
        isBootstrapping: false,
      });

      return {
        success: false,
        error: result.error,
      };
    }

    set({
      token: result.token,
      userEmail: email,
      isAuthenticated: true,
      isBootstrapping: false,
    });

    return {
      success: true,
      error: null,
    };
  },

  logout: async () => {
    await logoutService();

    set({
      token: null,
      userEmail: '',
      isAuthenticated: false,
    });
  },
}));
