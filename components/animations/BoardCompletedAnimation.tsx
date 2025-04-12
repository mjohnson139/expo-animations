import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
  Easing,
  interpolateColor,
  runOnJS
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// Ripple effect component for the fireworks animation
const RippleParticle = ({ 
  index, 
  x, 
  y, 
  color, 
  size, 
  speed, 
  particleCount,
  onAnimationComplete 
}) => {
  // Animation values
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  
  // Calculate angle for this particle (distribute in a circle)
  const angle = (index / particleCount) * Math.PI * 2;
  
  // Random distance from center
  const distance = Math.random() * 100 + 50;
  
  // Calculate target position
  const targetX = Math.cos(angle) * distance;
  const targetY = Math.sin(angle) * distance;

  useEffect(() => {
    // Initial state
    scale.value = 0;
    opacity.value = 0;
    translateX.value = 0;
    translateY.value = 0;
    
    // Start animation sequence
    opacity.value = withTiming(0.8, { 
      duration: 100,
      easing: Easing.inOut(Easing.quad)
    });
    
    scale.value = withTiming(1, { 
      duration: 200,
      easing: Easing.out(Easing.back(1.5))
    });
    
    // Move particles outward
    translateX.value = withTiming(targetX, { 
      duration: 1000 / speed,
      easing: Easing.out(Easing.quad)
    });
    
    translateY.value = withTiming(targetY, { 
      duration: 1000 / speed,
      easing: Easing.out(Easing.quad)
    });
    
    // Fade out
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
        styles.rippleParticle,
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

// Main fireworks component using ripple effect
export const BoardCompletedAnimation = ({ 
  isPlaying, 
  onAnimationComplete,
  speed = 1,
  particles = 50,
  colorScheme = 'Rainbow',
  position = 'center', // 'center', 'top', 'bottom'
  opacity = 0.8,
  size = 1.0
}) => {
  // Center position based on position prop
  let centerX, centerY;
  
  switch (position) {
    case 'top':
      centerX = width / 2;
      centerY = height * 0.25;
      break;
    case 'bottom':
      centerX = width / 2;
      centerY = height * 0.75;
      break;
    case 'center':
    default:
      centerX = width / 2;
      centerY = height / 2;
  }
  
  // Ripple wave animation
  const rippleScale = useSharedValue(0);
  const rippleOpacity = useSharedValue(0);
  
  useEffect(() => {
    if (isPlaying) {
      // Initial state
      rippleScale.value = 0;
      rippleOpacity.value = 0;
      
      // Animate ripple wave
      rippleOpacity.value = withTiming(0.5, { duration: 100 });
      rippleScale.value = withTiming(1, { 
        duration: 1000 / speed,
        easing: Easing.out(Easing.cubic)
      });
      
      // Fade out ripple
      rippleOpacity.value = withDelay(
        500 / speed,
        withTiming(0, { duration: 500 / speed })
      );
    }
  }, [isPlaying]);
  
  const rippleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: rippleScale.value }],
      opacity: rippleOpacity.value,
    };
  });
  
  // Generate particles when animation is playing
  const particleElements = isPlaying ? Array.from({ length: particles }).map((_, index) => {
    // Determine color based on color scheme
    let color;
    switch (colorScheme) {
      case 'Gold':
        color = `rgba(255, ${180 + Math.floor(Math.random() * 75)}, ${Math.floor(Math.random() * 100)}, ${opacity})`;
        break;
      case 'Blue':
        color = `rgba(${Math.floor(Math.random() * 100)}, ${100 + Math.floor(Math.random() * 155)}, 255, ${opacity})`;
        break;
      case 'Custom':
        // Custom rainbow with more purples and pinks
        const hue = Math.floor(Math.random() * 360);
        const lightness = 50 + Math.floor(Math.random() * 30);
        color = `hsla(${hue}, 100%, ${lightness}%, ${opacity})`;
        break;
      case 'Rainbow':
      default:
        // Rainbow colors
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        color = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    
    // Random size for particles, scaled by the size prop
    const particleSize = (Math.random() * 6 + 4) * size;
    
    return (
      <RippleParticle
        key={index}
        index={index}
        x={centerX}
        y={centerY}
        color={color}
        size={particleSize}
        speed={speed}
        particleCount={particles}
        onAnimationComplete={onAnimationComplete}
      />
    );
  }) : null;

  return (
    <View style={[styles.container, { pointerEvents: 'none' }]}>
      {isPlaying && (
        <Animated.View 
          style={[
            styles.rippleWave,
            {
              width: 200 * size,
              height: 200 * size,
              borderRadius: 100 * size,
              backgroundColor: colorScheme === 'Gold' 
                ? 'rgba(255, 215, 0, 0.2)' 
                : colorScheme === 'Blue' 
                  ? 'rgba(0, 100, 255, 0.2)'
                  : 'rgba(255, 255, 255, 0.2)',
              top: centerY - 100 * size,
              left: centerX - 100 * size,
            },
            rippleStyle
          ]}
        />
      )}
      {particleElements}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Ensure it's above game elements
  },
  rippleParticle: {
    position: 'absolute',
  },
  rippleWave: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
