
import React, { useEffect, useRef } from 'react';
import { Pressable, Animated, StyleSheet } from 'react-native';

interface Props {
  value: boolean;
  onValueChange: (v: boolean) => void;
}

export default function CustomSwitch({ value, onValueChange }: Props) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  // animate when `value` changes
  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const trackColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#CCC', '#6200EE'],
  });
  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22], // shift thumb
  });

  return (
    <Pressable onPress={() => onValueChange(!value)}>
      <Animated.View style={[styles.track, { backgroundColor: trackColor }]} />
      <Animated.View style={[styles.thumb, { transform: [{ translateX }] }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 44,
    height: 24,
    borderRadius: 12,
  },
  thumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFF',
    top: 2,
    left: 2,
    elevation: 1,
  },
});
