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
import { BoardCompletedAnimation } from '@/components/animations/BoardCompletedAnimation';
import { HighScoreAnimation } from '@/components/animations/HighScoreAnimation';
import { OnFireAnimation } from '@/components/animations/OnFireAnimation';

// Mock game board component to demonstrate overlay animations
const GameBoard = ({ animationType }) => {
  const backgroundColor = useThemeColor({ light: '#f0f0f0', dark: '#333333' }, 'background');
  const accentColor = useThemeColor({ light: '#007AFF', dark: '#0A84FF' }, 'tint');
  
  // Create a simple grid to represent a game board
  const renderGrid = () => {
    const rows = 6;
    const cols = 6;
    const cells = [];
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        // Add some variety to the cells based on animation type
        let cellColor;
        if (animationType === 'board-completed') {
          // Completed board pattern
          cellColor = (i + j) % 2 === 0 ? '#4CAF50' : '#8BC34A';
        } else if (animationType === 'high-score') {
          // High score pattern
          cellColor = (i + j) % 3 === 0 ? '#FFC107' : (i + j) % 3 === 1 ? '#FF9800' : '#FF5722';
        } else {
          // On fire pattern
          cellColor = (i + j) % 3 === 0 ? '#F44336' : (i + j) % 3 === 1 ? '#E91E63' : '#9C27B0';
        }
        
        cells.push(
          <View 
            key={`${i}-${j}`} 
            style={[
              styles.gridCell, 
              { 
                backgroundColor: cellColor,
                top: i * 50,
                left: j * 50
              }
            ]} 
          />
        );
      }
    }
    
    return cells;
  };
  
  return (
    <View style={styles.gameBoardContainer}>
      {renderGrid()}
    </View>
  );
};

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
      { id: 'colors', name: 'Color Scheme', options: ['Rainbow', 'Gold', 'Blue', 'Custom'], default: 'Rainbow' },
      { id: 'position', name: 'Position', options: ['center', 'top', 'bottom'], default: 'center' },
      { id: 'opacity', name: 'Opacity', min: 0.1, max: 1, default: 0.8, step: 0.1 }
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
      { id: 'sound', name: 'Sound Effect', options: ['Trumpet', 'Applause', 'Chime', 'None'], default: 'Applause' },
      { id: 'position', name: 'Position', options: ['center', 'top', 'bottom'], default: 'center' },
      { id: 'opacity', name: 'Opacity', min: 0.1, max: 1, default: 0.8, step: 0.1 }
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
      { id: 'smoke', name: 'Smoke Effect', options: ['None', 'Light', 'Heavy'], default: 'Light' },
      { id: 'position', name: 'Position', options: ['center', 'bottom', 'top'], default: 'bottom' },
      { id: 'opacity', name: 'Opacity', min: 0.1, max: 1, default: 0.8, step: 0.1 },
      { id: 'edge-only', name: 'Edge Only Mode', options: ['Yes', 'No'], default: 'No' }
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

  const handleAnimationComplete = () => {
    setIsPlaying(false);
  };

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

  // Render the appropriate animation based on the animation ID
  const renderAnimation = () => {
    if (!isPlaying) return null;

    switch (id) {
      case 'board-completed':
        return (
          <BoardCompletedAnimation 
            isPlaying={isPlaying}
            onAnimationComplete={handleAnimationComplete}
            speed={controlValues.speed as number}
            particles={controlValues.particles as number}
            colorScheme={controlValues.colors as string}
            position={controlValues.position as string}
            opacity={controlValues.opacity as number}
          />
        );
      case 'high-score':
        return (
          <HighScoreAnimation 
            isPlaying={isPlaying}
            onAnimationComplete={handleAnimationComplete}
            duration={controlValues.duration as number}
            intensity={controlValues.intensity as number}
            soundEffect={controlValues.sound as string}
            position={controlValues.position as string}
            opacity={controlValues.opacity as number}
          />
        );
      case 'on-fire':
        return (
          <OnFireAnimation 
            isPlaying={isPlaying}
            onAnimationComplete={handleAnimationComplete}
            flameHeight={controlValues['flame-height'] as number}
            flameColor={controlValues['flame-color'] as string}
            smokeEffect={controlValues.smoke as string}
            position={controlValues.position as string}
            opacity={controlValues.opacity as number}
            edgeOnly={controlValues['edge-only'] === 'Yes'}
          />
        );
      default:
        return null;
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
          <View style={styles.animationPreview}>
            {/* Game board to demonstrate overlay */}
            <GameBoard animationType={id as string} />
            
            {/* Animation overlay */}
            {renderAnimation()}
            
            {!isPlaying && (
              <View style={styles.previewOverlay}>
                <Ionicons 
                  name={getAnimationIcon()} 
                  size={80} 
                  color={accentColor} 
                />
                <ThemedText style={styles.animationPreviewText}>
                  Tap Play to preview overlay animation
                </ThemedText>
              </View>
            )}
          </View>
          
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
        
        <View style={styles.overlayInfoSection}>
          <ThemedText style={styles.overlayInfoTitle}>Overlay Animation Features</ThemedText>
          <ThemedText style={styles.overlayInfoText}>
            These animations are designed to work as overlays on your game board. They use transparency
            and non-interactive elements to ensure they don't interfere with gameplay while providing
            visual feedback to players.
          </ThemedText>
          
          <ThemedText style={styles.overlayFeatureTitle}>Key Features:</ThemedText>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={20} color={accentColor} style={styles.featureIcon} />
            <ThemedText style={styles.featureText}>Transparent elements that don't obscure game content</ThemedText>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={20} color={accentColor} style={styles.featureIcon} />
            <ThemedText style={styles.featureText}>Configurable positioning (center, top, bottom)</ThemedText>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={20} color={accentColor} style={styles.featureIcon} />
            <ThemedText style={styles.featureText}>Adjustable opacity to match your game's visual style</ThemedText>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={20} color={accentColor} style={styles.featureIcon} />
            <ThemedText style={styles.featureText}>Non-interactive (pointerEvents: 'none') to allow gameplay to continue</ThemedText>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={20} color={accentColor} style={styles.featureIcon} />
            <ThemedText style={styles.featureText}>Edge-only mode for subtle visual indicators (You're On Fire animation)</ThemedText>
          </View>
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
    width: 300,
    height: 300,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animationPreviewText: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 12,
    textAlign: 'center',
    paddingHorizontal: 20,
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
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  controlsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  overlayInfoSection: {
    padding: 16,
    paddingBottom: 32,
  },
  overlayInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  overlayInfoText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  overlayFeatureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIcon: {
    marginRight: 8,
  },
  featureText: {
    fontSize: 16,
    flex: 1,
  },
  gameBoardContainer: {
    width: 300,
    height: 300,
    position: 'relative',
  },
  gridCell: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
});
