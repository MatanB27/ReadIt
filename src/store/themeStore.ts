import { create } from 'zustand';

export const LIGHT_THEME = 'light';
export const DARK_THEME = 'dark';

export type ThemeMode = typeof LIGHT_THEME | typeof DARK_THEME;

type ThemeStore = {
  mode: ThemeMode;
  toggleMode: () => void;
};

export const useThemeStore = create<ThemeStore>((set) => ({
  mode: LIGHT_THEME,
  toggleMode: () => {
    set((state) => ({
      mode: state.mode === LIGHT_THEME ? DARK_THEME : LIGHT_THEME,
    }));
  },
}));
