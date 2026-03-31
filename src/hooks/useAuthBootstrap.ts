import { useEffect } from 'react';

import { useAuthStore } from '../store/authStore';

export const useAuthBootstrap = (): {
  isAuthenticated: boolean;
  isBootstrapping: boolean;
} => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isBootstrapping = useAuthStore((state) => state.isBootstrapping);
  const bootstrapAuth = useAuthStore((state) => state.bootstrapAuth);

  useEffect(() => {
    const loadAuth = async () => {
      await bootstrapAuth();
    };

    loadAuth();
  }, [bootstrapAuth]);

  return {
    isAuthenticated,
    isBootstrapping,
  };
};
