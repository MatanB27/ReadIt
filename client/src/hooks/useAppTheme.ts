import { colors } from '../theme/colors';
import { DARK_THEME } from '../store/themeStore';
import { useThemeStore } from '../store/themeStore';

export const useAppTheme = () => {
  const mode = useThemeStore((state) => state.mode);
  const activeColors = mode === DARK_THEME ? colors.dark : colors.light;

  return {
    mode,
    colors: activeColors,
  };
};
