import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);

export const SkeletonRow = () => {
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
    <View style={styles.row}>
      <View style={styles.content}>
        <AnimatedView style={[styles.title, animatedStyle]} />
        <AnimatedView style={[styles.metaWide, animatedStyle]} />
        <AnimatedView style={[styles.metaShort, animatedStyle]} />
      </View>

      <AnimatedView style={[styles.button, animatedStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    marginBottom: 14,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2D7C8',
    backgroundColor: '#FFFDF9',
  },
  content: {
    gap: 8,
    marginBottom: 14,
  },
  title: {
    height: 22,
    width: '86%',
    borderRadius: 8,
    backgroundColor: '#E8DED1',
  },
  metaWide: {
    height: 14,
    width: '62%',
    borderRadius: 999,
    backgroundColor: '#E8DED1',
  },
  metaShort: {
    height: 14,
    width: '48%',
    borderRadius: 999,
    backgroundColor: '#E8DED1',
  },
  button: {
    height: 32,
    width: 88,
    borderRadius: 999,
    backgroundColor: '#E8DED1',
  },
});
