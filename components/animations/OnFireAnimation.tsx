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

// Flame particle component
const FlameParticle = ({ 
  index, 
  position,
  flameHeight, 
  flameColor, 
  smokeEffect,
  opacity,
  onAnimationComplete 
}) => {
  // Animation values
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(0);
  const particleOpacity = useSharedValue(0);
  const colorProgress = useSharedValue(0);
  
  // Base position
  const baseX = position.x;
  const baseY = position.y;
  
  // Particle size based on position (smaller at top)
  const size = Math.max(5, 20 - (index % 5) * 3);
  
  // Determine base colors based on flame color selection
  let baseColor, topColor;
  switch (flameColor) {
    case 'Blue':
      baseColor = `rgba(0, 102, 255, ${opacity})`;
      topColor = `rgba(102, 204, 255, ${opacity})`;
      break;
    case 'Green':
      baseColor = `rgba(0, 204, 102, ${opacity})`;
      topColor = `rgba(102, 255, 204, ${opacity})`;
      break;
    case 'Purple':
      baseColor = `rgba(153, 51, 255, ${opacity})`;
      topColor = `rgba(204, 153, 255, ${opacity})`;
      break;
    case 'Red-Orange':
    default:
      baseColor = `rgba(255, 51, 0, ${opacity})`;
      topColor = `rgba(255, 204, 0, ${opacity})`;
  }
  
  // Add smoke effect if enabled
  const isSmoke = smokeEffect !== 'None' && index % 10 === 0;
  const smokeIntensity = smokeEffect === 'Heavy' ? 0.7 : 0.4;
  
  useEffect(() => {
    // Initial position with slight randomness
    const startX = (Math.random() * 20 - 10);
    translateX.value = startX;
    translateY.value = 0;
    
    // Random movement pattern
    const moveX = startX + (Math.random() * 30 - 15);
    const moveY = -(50 + Math.random() * 50) * flameHeight / 5;
    
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
    particleOpacity.value = withDelay(
      index * 10,
      withSequence(
        withTiming(isSmoke ? smokeIntensity * opacity : 0.8 * opacity, { 
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
      opacity: particleOpacity.value,
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
          left: baseX,
          bottom: baseY,
        },
        animatedStyle,
      ]}
    />
  );
};

// Text overlay for "You're On Fire!"
const FireText = ({ position, opacity = 0.9 }) => {
  const scale = useSharedValue(0);
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
      opacity: textOpacity.value,
    };
  });

  return (
    <Animated.View 
      style={[
        styles.fireTextContainer, 
        { top: position.y - 100 },
        animatedStyle
      ]}
    >
      <Text style={styles.fireText}>YOU'RE ON FIRE!</Text>
    </Animated.View>
  );
};

// Edge flame effect
const EdgeFlame = ({ 
  side, // 'left', 'right', 'bottom', 'top'
  flameColor,
  flameHeight,
  opacity
}) => {
  const flameIntensity = useSharedValue(0);
  
  useEffect(() => {
    flameIntensity.value = withRepeat(
      withSequence(
        withTiming(1, { 
          duration: 500,
          easing: Easing.inOut(Easing.quad)
        }),
        withTiming(0.7, { 
          duration: 500,
          easing: Easing.inOut(Easing.quad)
        })
      ),
      -1, // Infinite
      true // Reverse
    );
  }, []);
  
  // Determine base colors based on flame color selection
  let baseColor, topColor;
  switch (flameColor) {
    case 'Blue':
      baseColor = `rgba(0, 102, 255, ${opacity})`;
      topColor = `rgba(102, 204, 255, ${opacity * 0.7})`;
      break;
    case 'Green':
      baseColor = `rgba(0, 204, 102, ${opacity})`;
      topColor = `rgba(102, 255, 204, ${opacity * 0.7})`;
      break;
    case 'Purple':
      baseColor = `rgba(153, 51, 255, ${opacity})`;
      topColor = `rgba(204, 153, 255, ${opacity * 0.7})`;
      break;
    case 'Red-Orange':
    default:
      baseColor = `rgba(255, 51, 0, ${opacity})`;
      topColor = `rgba(255, 204, 0, ${opacity * 0.7})`;
  }
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: flameIntensity.value * opacity,
    };
  });
  
  // Determine position and dimensions based on side
  let styleProps = {};
  
  switch (side) {
    case 'left':
      styleProps = {
        left: 0,
        top: height * 0.3,
        width: 10 * flameHeight,
        height: height * 0.4,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        backgroundGradient: { x: 0, y: 0.5 }
      };
      break;
    case 'right':
      styleProps = {
        right: 0,
        top: height * 0.3,
        width: 10 * flameHeight,
        height: height * 0.4,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        backgroundGradient: { x: 1, y: 0.5 }
      };
      break;
    case 'bottom':
      styleProps = {
        bottom: 0,
        left: width * 0.2,
        width: width * 0.6,
        height: 10 * flameHeight,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundGradient: { x: 0.5, y: 1 }
      };
      break;
    case 'top':
      styleProps = {
        top: 0,
        left: width * 0.2,
        width: width * 0.6,
        height: 10 * flameHeight,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        backgroundGradient: { x: 0.5, y: 0 }
      };
      break;
  }
  
  return (
    <Animated.View
      style={[
        styles.edgeFlame,
        styleProps,
        {
          backgroundColor: baseColor,
        },
        animatedStyle
      ]}
    />
  );
};

// Main fire animation component
export const OnFireAnimation = ({ 
  isPlaying, 
  onAnimationComplete,
  flameHeight = 5,
  flameColor = 'Red-Orange',
  smokeEffect = 'Light',
  position = 'center', // 'center', 'top', 'bottom'
  opacity = 0.8,
  edgeOnly = false // New prop to show flames only at the edges
}) => {
  // Determine position based on the position prop
  let centerPosition = { x: 0, y: 0 };
  
  switch (position) {
    case 'top':
      centerPosition = { x: width / 2, y: height * 0.25 };
      break;
    case 'bottom':
      centerPosition = { x: width / 2, y: height * 0.1 };
      break;
    case 'center':
    default:
      centerPosition = { x: width / 2, y: height * 0.1 };
  }
  
  // Number of particles based on flame height
  const particleCount = edgeOnly ? 0 : Math.floor(flameHeight * 20);
  
  // Generate flame particles when animation is playing and not in edge-only mode
  const flameElements = (isPlaying && !edgeOnly) ? Array.from({ length: particleCount }).map((_, index) => {
    return (
      <FlameParticle
        key={index}
        index={index}
        position={centerPosition}
        flameHeight={flameHeight}
        flameColor={flameColor}
        smokeEffect={smokeEffect}
        opacity={opacity}
        onAnimationComplete={onAnimationComplete}
      />
    );
  }) : null;
  
  // Edge flames (always shown, more prominent in edge-only mode)
  const edgeFlames = isPlaying ? (
    <>
      <EdgeFlame 
        side="left" 
        flameColor={flameColor} 
        flameHeight={flameHeight} 
        opacity={edgeOnly ? opacity : opacity * 0.6} 
      />
      <EdgeFlame 
        side="right" 
        flameColor={flameColor} 
        flameHeight={flameHeight} 
        opacity={edgeOnly ? opacity : opacity * 0.6} 
      />
      <EdgeFlame 
        side="bottom" 
        flameColor={flameColor} 
        flameHeight={flameHeight} 
        opacity={edgeOnly ? opacity : opacity * 0.6} 
      />
      {edgeOnly && (
        <EdgeFlame 
          side="top" 
          flameColor={flameColor} 
          flameHeight={flameHeight} 
          opacity={opacity * 0.4} 
        />
      )}
    </>
  ) : null;

  return (
    <View style={[styles.container, { pointerEvents: 'none' }]}>
      {isPlaying && !edgeOnly && (
        <FireText position={centerPosition} opacity={opacity} />
      )}
      {flameElements}
      {edgeFlames}
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
  flameParticle: {
    position: 'absolute',
  },
  fireTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1001,
  },
  fireText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF3300',
    textShadowColor: 'rgba(255, 102, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  edgeFlame: {
    position: 'absolute',
    zIndex: 999,
  }
});
