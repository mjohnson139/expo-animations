import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  runOnJS
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// Firework particle component
const Particle = ({ 
  index, 
  x, 
  y, 
  color, 
  size, 
  speed, 
  particleCount,
  onAnimationComplete 
}) => {
  // Calculate angle for this particle (distribute in a circle)
  const angle = (index / particleCount) * Math.PI * 2;
  
  // Random distance from center
  const distance = Math.random() * 100 + 50;
  
  // Calculate target position
  const targetX = x + Math.cos(angle) * distance;
  const targetY = y + Math.sin(angle) * distance;
  
  // Animation values
  const translateX = useSharedValue(x);
  const translateY = useSharedValue(y);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    // Start position
    translateX.value = x;
    translateY.value = y;
    scale.value = 0;
    opacity.value = 1;
    
    // Animate to target position
    translateX.value = withTiming(targetX, { 
      duration: 1000 / speed,
      easing: Easing.out(Easing.quad)
    });
    
    translateY.value = withSequence(
      // First go up slightly
      withTiming(y - 20, { 
        duration: 200 / speed,
        easing: Easing.out(Easing.quad)
      }),
      // Then fall to target
      withTiming(targetY, { 
        duration: 800 / speed,
        easing: Easing.out(Easing.quad)
      })
    );
    
    // Scale up quickly
    scale.value = withTiming(1, { 
      duration: 200 / speed,
      easing: Easing.out(Easing.quad)
    });
    
    // Fade out at the end
    opacity.value = withDelay(
      800 / speed,
      withTiming(0, { 
        duration: 200 / speed,
        easing: Easing.in(Easing.quad)
      }, () => {
        if (index === particleCount - 1) {
          runOnJS(onAnimationComplete)();
        }
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value }
      ],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    />
  );
};

// Main fireworks component
export const BoardCompletedAnimation = ({ 
  isPlaying, 
  onAnimationComplete,
  speed = 1,
  particles = 50,
  colorScheme = 'Rainbow'
}) => {
  // Center position
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Generate particles when animation is playing
  const particleElements = isPlaying ? Array.from({ length: particles }).map((_, index) => {
    // Determine color based on color scheme
    let color;
    switch (colorScheme) {
      case 'Gold':
        color = `rgb(255, ${180 + Math.floor(Math.random() * 75)}, ${Math.floor(Math.random() * 100)})`;
        break;
      case 'Blue':
        color = `rgb(${Math.floor(Math.random() * 100)}, ${100 + Math.floor(Math.random() * 155)}, 255)`;
        break;
      case 'Custom':
        // Custom rainbow with more purples and pinks
        const hue = Math.floor(Math.random() * 360);
        color = `hsl(${hue}, 100%, 60%)`;
        break;
      case 'Rainbow':
      default:
        // Rainbow colors
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        color = `rgb(${r}, ${g}, ${b})`;
    }
    
    // Random size for particles
    const size = Math.random() * 6 + 4;
    
    return (
      <Particle
        key={index}
        index={index}
        x={centerX}
        y={centerY}
        color={color}
        size={size}
        speed={speed}
        particleCount={particles}
        onAnimationComplete={onAnimationComplete}
      />
    );
  }) : null;

  return (
    <View style={styles.container}>
      {particleElements}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  particle: {
    position: 'absolute',
  },
});
