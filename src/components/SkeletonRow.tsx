import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useAppTheme } from '../hooks/useAppTheme';

const AnimatedView = Animated.createAnimatedComponent(View);

export const SkeletonRow = () => {
  const theme = useAppTheme();
  const opacity = useSharedValue(0.55);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(withTiming(0.9, { duration: 700 }), withTiming(0.55, { duration: 700 })),
      -1,
      false
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <View style={[styles.row, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
      <View style={styles.content}>
        <AnimatedView style={[styles.title, { backgroundColor: theme.colors.skeleton }, animatedStyle]} />
        <AnimatedView style={[styles.metaWide, { backgroundColor: theme.colors.skeleton }, animatedStyle]} />
        <AnimatedView style={[styles.metaShort, { backgroundColor: theme.colors.skeleton }, animatedStyle]} />
      </View>

      <AnimatedView style={[styles.button, { backgroundColor: theme.colors.skeleton }, animatedStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    marginBottom: 14,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  content: {
    gap: 8,
    marginBottom: 14,
  },
  title: {
    height: 22,
    width: '86%',
    borderRadius: 8,
  },
  metaWide: {
    height: 14,
    width: '62%',
    borderRadius: 999,
  },
  metaShort: {
    height: 14,
    width: '48%',
    borderRadius: 999,
  },
  button: {
    height: 32,
    width: 88,
    borderRadius: 999,
  },
});
