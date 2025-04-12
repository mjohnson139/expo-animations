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
  runOnJS
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Star component for the high score animation
const Star = ({ 
  index, 
  delay, 
  size, 
  color, 
  duration, 
  intensity,
  onAnimationComplete 
}) => {
  // Random position
  const x = Math.random() * width * 0.8 + width * 0.1;
  const y = Math.random() * height * 0.6 + height * 0.2;
  
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
      <Ionicons name="star" size={size} color={color} />
    </Animated.View>
  );
};

// Score text animation
const ScoreText = ({ 
  duration, 
  intensity 
}) => {
  const scale = useSharedValue(0);
  const translateY = useSharedValue(20);
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
    
    translateY.value = withSequence(
      withTiming(20, { duration: 0 }),
      withTiming(0, { 
        duration: 300,
        easing: Easing.out(Easing.back(2))
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
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={[styles.scoreTextContainer, animatedStyle]}>
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
  soundEffect = 'Applause'
}) => {
  // Number of stars based on intensity
  const starCount = Math.floor(intensity * 3);
  
  // Generate stars when animation is playing
  const starElements = isPlaying ? Array.from({ length: starCount }).map((_, index) => {
    // Random size for stars
    const size = Math.random() * 10 + 20;
    
    // Random color for stars
    const colors = ['#FFD700', '#FFA500', '#FF4500', '#FF6347', '#00BFFF', '#1E90FF'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Delay between stars
    const delay = 100;
    
    return (
      <Star
        key={index}
        index={index}
        delay={delay}
        size={size}
        color={color}
        duration={duration}
        intensity={intensity}
        onAnimationComplete={onAnimationComplete}
      />
    );
  }) : null;

  return (
    <View style={styles.container}>
      {isPlaying && <ScoreText duration={duration} intensity={intensity} />}
      {starElements}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  starContainer: {
    position: 'absolute',
  },
  scoreTextContainer: {
    position: 'absolute',
    top: height * 0.4,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFD700',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
});
