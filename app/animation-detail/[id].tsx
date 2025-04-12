import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AnimationControl } from '@/components/AnimationControl';
import { useThemeColor } from '@/hooks/useThemeColor';

// Animation data that will be displayed in the detail page
const ANIMATIONS = {
  'board-completed': {
    id: 'board-completed',
    title: 'Board Completed',
    description: 'A celebratory fireworks animation for completing a board. This animation is designed to reward players when they successfully complete a level or board in your game. The colorful fireworks create a sense of achievement and celebration.',
    type: 'fireworks',
    controls: [
      { id: 'speed', name: 'Speed', min: 0.1, max: 2, default: 1, step: 0.1 },
      { id: 'particles', name: 'Particles', min: 10, max: 100, default: 50, step: 5 },
      { id: 'colors', name: 'Color Scheme', options: ['Rainbow', 'Gold', 'Blue', 'Custom'], default: 'Rainbow' }
    ]
  },
  'high-score': {
    id: 'high-score',
    title: 'High Score',
    description: 'Animation to celebrate achieving a high score. This animation creates an exciting visual reward when players beat their previous best score or reach a new milestone. The animation emphasizes the achievement with dynamic elements that draw attention to the score.',
    type: 'celebration',
    controls: [
      { id: 'duration', name: 'Duration', min: 1, max: 5, default: 3, step: 0.5 },
      { id: 'intensity', name: 'Intensity', min: 1, max: 10, default: 5, step: 1 },
      { id: 'sound', name: 'Sound Effect', options: ['Trumpet', 'Applause', 'Chime', 'None'], default: 'Applause' }
    ]
  },
  'on-fire': {
    id: 'on-fire',
    title: 'You\'re On Fire',
    description: 'Animation to show the user is on a winning streak. This dynamic flame animation visually represents a player\'s hot streak, encouraging them to maintain their momentum. The intensity of the flames can be adjusted to match the significance of the streak.',
    type: 'flame',
    controls: [
      { id: 'flame-height', name: 'Flame Height', min: 1, max: 10, default: 5, step: 1 },
      { id: 'flame-color', name: 'Flame Color', options: ['Red-Orange', 'Blue', 'Green', 'Purple'], default: 'Red-Orange' },
      { id: 'smoke', name: 'Smoke Effect', options: ['None', 'Light', 'Heavy'], default: 'Light' }
    ]
  }
};

export default function AnimationDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const animation = ANIMATIONS[id as string];
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [controlValues, setControlValues] = useState<Record<string, number | string>>({});
  
  const backgroundColor = useThemeColor({ light: '#f0f0f0', dark: '#333333' }, 'background');
  const accentColor = useThemeColor({ light: '#007AFF', dark: '#0A84FF' }, 'tint');
  
  // Animation values for the preview
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.7);
  const rotation = useSharedValue(0);
  
  // Initialize control values
  useEffect(() => {
    if (animation) {
      const initialValues: Record<string, number | string> = {};
      animation.controls.forEach(control => {
        initialValues[control.id] = control.default;
      });
      setControlValues(initialValues);
    }
  }, [animation]);

  // Animation effects when playing
  useEffect(() => {
    if (isPlaying) {
      // Start animation
      scale.value = withTiming(1.1, { duration: 500, easing: Easing.inOut(Easing.ease) });
      opacity.value = withTiming(1, { duration: 300 });
      
      // Create a rotation animation based on the animation type
      if (animation.type === 'fireworks') {
        rotation.value = 0; // Reset rotation
        // No rotation for fireworks
      } else if (animation.type === 'celebration') {
        rotation.value = withTiming(360, { 
          duration: 2000 * (controlValues['duration'] as number || 3),
          easing: Easing.linear
        });
      } else if (animation.type === 'flame') {
        // Subtle rotation for flame
        rotation.value = withTiming(10, { 
          duration: 1000, 
          easing: Easing.inOut(Easing.ease)
        });
      }
    } else {
      // Reset animation
      scale.value = withTiming(1, { duration: 300, easing: Easing.inOut(Easing.ease) });
      opacity.value = withTiming(0.7, { duration: 300 });
      rotation.value = withTiming(0, { duration: 300 });
    }
  }, [isPlaying, animation?.type, controlValues]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` }
      ],
      opacity: opacity.value,
    };
  });

  if (!animation) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Animation Not Found',
            headerShown: true,
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#007AFF" />
              </TouchableOpacity>
            ),
          }}
        />
        <View style={styles.center}>
          <ThemedText>Animation not found</ThemedText>
        </View>
      </ThemedView>
    );
  }

  const handleControlChange = (controlId: string, value: number | string) => {
    setControlValues(prev => ({
      ...prev,
      [controlId]: value
    }));
  };

  // Get the appropriate icon based on animation type
  const getAnimationIcon = () => {
    switch (animation.type) {
      case 'fireworks':
        return 'sparkles';
      case 'celebration':
        return 'trophy';
      case 'flame':
        return 'flame';
      default:
        return 'star';
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: animation.title,
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={accentColor} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.animationContainer}>
          <Animated.View 
            style={[
              styles.animationPreview, 
              { backgroundColor: backgroundColor },
              animatedStyle
            ]}
          >
            <Ionicons 
              name={getAnimationIcon()} 
              size={80} 
              color={accentColor} 
            />
            <ThemedText style={styles.animationPreviewText}>
              {isPlaying ? 'Animation Playing' : 'Preview'}
            </ThemedText>
          </Animated.View>
          
          <View style={styles.playbackControls}>
            <TouchableOpacity
              style={[
                styles.playButton, 
                { backgroundColor: isPlaying ? '#FF3B30' : accentColor }
              ]}
              onPress={() => setIsPlaying(!isPlaying)}
            >
              <Ionicons
                name={isPlaying ? 'stop' : 'play'}
                size={24}
                color="white"
              />
              <ThemedText style={styles.playButtonText}>
                {isPlaying ? 'Stop' : 'Play Animation'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.detailsSection}>
          <ThemedText style={styles.detailsTitle}>Description</ThemedText>
          <ThemedText style={styles.description}>{animation.description}</ThemedText>
          <ThemedText style={styles.typeLabel}>Type: <ThemedText style={styles.typeValue}>{animation.type}</ThemedText></ThemedText>
        </View>
        
        <View style={styles.controlsSection}>
          <ThemedText style={styles.controlsTitle}>Animation Controls</ThemedText>
          {animation.controls.map(control => {
            if (control.options) {
              return (
                <AnimationControl
                  key={control.id}
                  label={control.name}
                  value={controlValues[control.id] || control.default}
                  onChange={(value) => handleControlChange(control.id, value)}
                  options={control.options}
                />
              );
            } else {
              return (
                <AnimationControl
                  key={control.id}
                  label={control.name}
                  value={controlValues[control.id] || control.default}
                  onChange={(value) => handleControlChange(control.id, value)}
                  min={control.min}
                  max={control.max}
                  step={control.step}
                />
              );
            }
          })}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  animationContainer: {
    padding: 16,
    alignItems: 'center',
  },
  animationPreview: {
    width: 200,
    height: 200,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  animationPreviewText: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 12,
  },
  playbackControls: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  playButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  detailsSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  typeLabel: {
    fontSize: 14,
  },
  typeValue: {
    fontWeight: 'bold',
  },
  controlsSection: {
    padding: 16,
    paddingBottom: 32,
  },
  controlsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
