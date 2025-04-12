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

// Flame particle component
const FlameParticle = ({ 
  index, 
  x, 
  y, 
  flameHeight, 
  flameColor, 
  smokeEffect,
  onAnimationComplete 
}) => {
  // Animation values
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const colorProgress = useSharedValue(0);
  
  // Particle size based on position (smaller at top)
  const size = Math.max(5, 20 - (index % 5) * 3);
  
  // Determine base colors based on flame color selection
  let baseColor, topColor;
  switch (flameColor) {
    case 'Blue':
      baseColor = '#0066FF';
      topColor = '#66CCFF';
      break;
    case 'Green':
      baseColor = '#00CC66';
      topColor = '#66FFCC';
      break;
    case 'Purple':
      baseColor = '#9933FF';
      topColor = '#CC99FF';
      break;
    case 'Red-Orange':
    default:
      baseColor = '#FF3300';
      topColor = '#FFCC00';
  }
  
  // Add smoke effect if enabled
  const isSmoke = smokeEffect !== 'None' && index % 10 === 0;
  const smokeIntensity = smokeEffect === 'Heavy' ? 0.7 : 0.4;
  
  useEffect(() => {
    // Initial position with slight randomness
    const startX = x + (Math.random() * 20 - 10);
    translateX.value = startX;
    translateY.value = y;
    
    // Random movement pattern
    const moveX = startX + (Math.random() * 30 - 15);
    const moveY = y - (50 + Math.random() * 50) * flameHeight / 5;
    
    // Animate position
    translateX.value = withDelay(
      index * 10,
      withTiming(moveX, { 
        duration: 1000 + Math.random() * 500,
        easing: Easing.out(Easing.sin)
      })
    );
    
    translateY.value = withDelay(
      index * 10,
      withTiming(moveY, { 
        duration: 1000 + Math.random() * 500,
        easing: Easing.out(Easing.sin)
      })
    );
    
    // Animate scale
    scale.value = withDelay(
      index * 10,
      withSequence(
        withTiming(1 + Math.random() * 0.5, { 
          duration: 300,
          easing: Easing.out(Easing.quad)
        }),
        withTiming(0, { 
          duration: 700 + Math.random() * 300,
          easing: Easing.in(Easing.quad)
        }, () => {
          if (index === 0) {
            runOnJS(onAnimationComplete)();
          }
        })
      )
    );
    
    // Animate opacity
    opacity.value = withDelay(
      index * 10,
      withSequence(
        withTiming(isSmoke ? smokeIntensity : 0.8 + Math.random() * 0.2, { 
          duration: 300,
          easing: Easing.out(Easing.quad)
        }),
        withTiming(0, { 
          duration: 700 + Math.random() * 300,
          easing: Easing.in(Easing.quad)
        })
      )
    );
    
    // Animate color
    colorProgress.value = withDelay(
      index * 10,
      withTiming(1, { 
        duration: 1000 + Math.random() * 500,
        easing: Easing.inOut(Easing.quad)
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    // Interpolate between base color and top color
    const backgroundColor = isSmoke 
      ? 'rgba(100, 100, 100, 0.5)' 
      : interpolateColor(
          colorProgress.value,
          [0, 1],
          [baseColor, topColor]
        );
    
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value }
      ],
      opacity: opacity.value,
      backgroundColor,
      borderRadius: isSmoke ? size : size / 2,
    };
  });

  return (
    <Animated.View
      style={[
        styles.flameParticle,
        {
          width: size,
          height: size,
        },
        animatedStyle,
      ]}
    />
  );
};

// Text overlay for "You're On Fire!"
const FireText = () => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    // Animate in
    scale.value = withSequence(
      withTiming(0, { duration: 0 }),
      withTiming(1.2, { 
        duration: 300,
        easing: Easing.out(Easing.back(2))
      }),
      withTiming(1, { 
        duration: 200,
        easing: Easing.inOut(Easing.quad)
      })
    );
    
    opacity.value = withTiming(1, { 
      duration: 300,
      easing: Easing.inOut(Easing.quad)
    });
    
    // Pulse effect
    scale.value = withDelay(
      500,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 0 }),
          withTiming(1.1, { 
            duration: 300,
            easing: Easing.inOut(Easing.quad)
          }),
          withTiming(1, { 
            duration: 300,
            easing: Easing.inOut(Easing.quad)
          })
        ),
        -1, // Infinite
        true // Reverse
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={[styles.fireTextContainer, animatedStyle]}>
      <Animated.Text style={styles.fireText}>YOU'RE ON FIRE!</Animated.Text>
    </Animated.View>
  );
};

// Main fire animation component
export const OnFireAnimation = ({ 
  isPlaying, 
  onAnimationComplete,
  flameHeight = 5,
  flameColor = 'Red-Orange',
  smokeEffect = 'Light'
}) => {
  // Base position for flames
  const baseX = width / 2;
  const baseY = height * 0.7;
  
  // Number of particles based on flame height
  const particleCount = Math.floor(flameHeight * 20);
  
  // Generate flame particles when animation is playing
  const flameElements = isPlaying ? Array.from({ length: particleCount }).map((_, index) => {
    return (
      <FlameParticle
        key={index}
        index={index}
        x={baseX}
        y={baseY}
        flameHeight={flameHeight}
        flameColor={flameColor}
        smokeEffect={smokeEffect}
        onAnimationComplete={onAnimationComplete}
      />
    );
  }) : null;

  return (
    <View style={styles.container}>
      {isPlaying && <FireText />}
      {flameElements}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flameParticle: {
    position: 'absolute',
  },
  fireTextContainer: {
    position: 'absolute',
    top: height * 0.3,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  fireText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF3300',
    textShadowColor: 'rgba(255, 102, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
});
