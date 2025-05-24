import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
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

// Star component for the high score animation
const Star = ({ 
  index, 
  delay, 
  size, 
  color, 
  duration, 
  intensity,
  position,
  onAnimationComplete 
}) => {
  // Random position based on center position
  const centerX = position.x;
  const centerY = position.y;
  
  // Calculate random position within a certain radius from center
  const radius = Math.min(width, height) * 0.3;
  const angle = Math.random() * Math.PI * 2;
  const distance = Math.random() * radius;
  
  const x = centerX + Math.cos(angle) * distance;
  const y = centerY + Math.sin(angle) * distance;
  
  // Animation values
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    // Start animation
    scale.value = 0;
    opacity.value = 0;
    rotate.value = 0;
    
    // Appear with delay based on index
    scale.value = withDelay(
      delay * index,
      withTiming(1 + (intensity / 10), { 
        duration: 300,
        easing: Easing.out(Easing.back(2))
      })
    );
    
    opacity.value = withDelay(
      delay * index,
      withTiming(1, { 
        duration: 300,
        easing: Easing.inOut(Easing.quad)
      })
    );
    
    // Rotate slightly
    rotate.value = withDelay(
      delay * index,
      withRepeat(
        withTiming(360, { 
          duration: 2000 / (intensity / 5),
          easing: Easing.linear
        }),
        -1 // Infinite
      )
    );
    
    // Fade out at the end
    opacity.value = withDelay(
      delay * index + (duration * 1000) - 300,
      withTiming(0, { 
        duration: 300,
        easing: Easing.in(Easing.quad)
      }, () => {
        if (index === 0) {
          runOnJS(onAnimationComplete)();
        }
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: x },
        { translateY: y },
        { scale: scale.value },
        { rotate: `${rotate.value}deg` }
      ],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        styles.starContainer,
        animatedStyle,
      ]}
    >
      <View style={[styles.star, { width: size, height: size, backgroundColor: color }]} />
    </Animated.View>
  );
};

// Score text animation
const ScoreText = ({ 
  duration, 
  intensity,
  position,
  opacity = 0.9
}) => {
  const scale = useSharedValue(0);
  const translateY = useSharedValue(20);
  const textOpacity = useSharedValue(0);

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
    
    translateY.value = withSequence(
      withTiming(20, { duration: 0 }),
      withTiming(0, { 
        duration: 300,
        easing: Easing.out(Easing.back(2))
      })
    );
    
    textOpacity.value = withTiming(opacity, { 
      duration: 300,
      easing: Easing.inOut(Easing.quad)
    });
    
    // Pulse effect
    scale.value = withDelay(
      500,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 0 }),
          withTiming(1 + (intensity / 20), { 
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
      transform: [
        { scale: scale.value },
        { translateY: translateY.value }
      ],
      opacity: textOpacity.value,
    };
  });

  return (
    <Animated.View 
      style={[
        styles.scoreTextContainer, 
        { top: position.y - 50 },
        animatedStyle
      ]}
    >
      <Text style={styles.scoreText}>HIGH SCORE!</Text>
    </Animated.View>
  );
};

// Main high score animation component
export const HighScoreAnimation = ({ 
  isPlaying, 
  onAnimationComplete,
  duration = 3,
  intensity = 5,
  soundEffect = 'Applause',
  position = 'center', // 'center', 'top', 'bottom'
  opacity = 0.9,
  size = 1.0
}) => {
  // Determine position based on the position prop
  let centerPosition = { x: 0, y: 0 };
  
  switch (position) {
    case 'top':
      centerPosition = { x: width / 2, y: height * 0.25 };
      break;
    case 'bottom':
      centerPosition = { x: width / 2, y: height * 0.75 };
      break;
    case 'center':
    default:
      centerPosition = { x: width / 2, y: height / 2 };
  }
  
  // Number of stars based on intensity
  const starCount = Math.floor(intensity * 3);
  
  // Generate stars when animation is playing
  const starElements = isPlaying ? Array.from({ length: starCount }).map((_, index) => {
    // Random size for stars, scaled by the size prop
    const starSize = (Math.random() * 10 + 20) * size;
    
    // Random color for stars with transparency
    const colors = [
      `rgba(255, 215, 0, ${opacity})`, // Gold
      `rgba(255, 165, 0, ${opacity})`, // Orange
      `rgba(255, 69, 0, ${opacity})`, // Red-Orange
      `rgba(255, 99, 71, ${opacity})`, // Tomato
      `rgba(0, 191, 255, ${opacity})`, // Deep Sky Blue
      `rgba(30, 144, 255, ${opacity})` // Dodger Blue
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Delay between stars
    const delay = 100;
    
    return (
      <Star
        key={index}
        index={index}
        delay={delay}
        size={starSize}
        color={color}
        duration={duration}
        intensity={intensity}
        position={centerPosition}
        onAnimationComplete={onAnimationComplete}
      />
    );
  }) : null;

  // Background glow effect
  const glowOpacity = useSharedValue(0);
  
  useEffect(() => {
    if (isPlaying) {
      glowOpacity.value = withTiming(0.3, { duration: 300 });
      glowOpacity.value = withDelay(
        duration * 1000 - 300,
        withTiming(0, { duration: 300 })
      );
    } else {
      glowOpacity.value = 0;
    }
  }, [isPlaying]);
  
  const glowStyle = useAnimatedStyle(() => {
    return {
      opacity: glowOpacity.value,
    };
  });

  return (
    <View style={[styles.container, { pointerEvents: 'none' }]}>
      {isPlaying && (
        <Animated.View 
          style={[
            styles.backgroundGlow,
            {
              backgroundColor: 'rgba(255, 215, 0, 0.2)',
            },
            glowStyle
          ]}
        />
      )}
      {isPlaying && (
        <ScoreText 
          duration={duration} 
          intensity={intensity} 
          position={centerPosition}
          opacity={opacity}
        />
      )}
      {starElements}
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
  starContainer: {
    position: 'absolute',
  },
  star: {
    borderRadius: 10,
    transform: [{ rotate: '45deg' }],
  },
  scoreTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1001,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFD700',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  backgroundGlow: {
    ...StyleSheet.absoluteFillObject,
  }
});
