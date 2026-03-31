import { colors } from '../theme/colors';
import { useThemeStore } from '../store/themeStore';

export const useAppTheme = () => {
  const mode = useThemeStore((state) => state.mode);

  return {
    mode,
    colors: colors[mode],
  };
};
