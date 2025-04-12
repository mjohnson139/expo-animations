import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Animation data that will be displayed in the detail page
const ANIMATIONS = {
  'board-completed': {
    id: 'board-completed',
    title: 'Board Completed',
    description: 'A celebratory fireworks animation for completing a board. This animation is designed to reward players when they successfully complete a level or board in your game. The colorful fireworks create a sense of achievement and celebration.',
    type: 'fireworks',
    controls: [
      { id: 'speed', name: 'Speed', min: 0.1, max: 2, default: 1 },
      { id: 'particles', name: 'Particles', min: 10, max: 100, default: 50 },
      { id: 'colors', name: 'Color Scheme', options: ['Rainbow', 'Gold', 'Blue', 'Custom'], default: 'Rainbow' }
    ]
  },
  'high-score': {
    id: 'high-score',
    title: 'High Score',
    description: 'Animation to celebrate achieving a high score. This animation creates an exciting visual reward when players beat their previous best score or reach a new milestone. The animation emphasizes the achievement with dynamic elements that draw attention to the score.',
    type: 'celebration',
    controls: [
      { id: 'duration', name: 'Duration', min: 1, max: 5, default: 3 },
      { id: 'intensity', name: 'Intensity', min: 1, max: 10, default: 5 },
      { id: 'sound', name: 'Sound Effect', options: ['Trumpet', 'Applause', 'Chime', 'None'], default: 'Applause' }
    ]
  },
  'on-fire': {
    id: 'on-fire',
    title: 'You\'re On Fire',
    description: 'Animation to show the user is on a winning streak. This dynamic flame animation visually represents a player\'s hot streak, encouraging them to maintain their momentum. The intensity of the flames can be adjusted to match the significance of the streak.',
    type: 'flame',
    controls: [
      { id: 'flame-height', name: 'Flame Height', min: 1, max: 10, default: 5 },
      { id: 'flame-color', name: 'Flame Color', options: ['Red-Orange', 'Blue', 'Green', 'Purple'], default: 'Red-Orange' },
      { id: 'smoke', name: 'Smoke Effect', options: ['None', 'Light', 'Heavy'], default: 'Light' }
    ]
  }
};

export default function AnimationDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const animation = ANIMATIONS[id];
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [controlValues, setControlValues] = useState({});
  
  // Initialize control values
  React.useEffect(() => {
    if (animation) {
      const initialValues = {};
      animation.controls.forEach(control => {
        initialValues[control.id] = control.default;
      });
      setControlValues(initialValues);
    }
  }, [animation]);

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

  const renderControlItem = (control) => {
    if (control.options) {
      // Render options selector
      return (
        <View key={control.id} style={styles.controlItem}>
          <ThemedText style={styles.controlLabel}>{control.name}</ThemedText>
          <View style={styles.optionsContainer}>
            {control.options.map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  controlValues[control.id] === option && styles.optionButtonSelected
                ]}
                onPress={() => {
                  setControlValues({
                    ...controlValues,
                    [control.id]: option
                  });
                }}
              >
                <ThemedText
                  style={[
                    styles.optionText,
                    controlValues[control.id] === option && styles.optionTextSelected
                  ]}
                >
                  {option}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    } else {
      // Render slider for numeric values
      return (
        <View key={control.id} style={styles.controlItem}>
          <View style={styles.controlHeader}>
            <ThemedText style={styles.controlLabel}>{control.name}</ThemedText>
            <ThemedText style={styles.controlValue}>{controlValues[control.id]}</ThemedText>
          </View>
          <View style={styles.sliderContainer}>
            <TouchableOpacity
              style={styles.sliderButton}
              onPress={() => {
                const newValue = Math.max(control.min, controlValues[control.id] - (control.max - control.min) / 10);
                setControlValues({
                  ...controlValues,
                  [control.id]: Number(newValue.toFixed(1))
                });
              }}
            >
              <Ionicons name="remove" size={20} color="#007AFF" />
            </TouchableOpacity>
            
            <View style={styles.sliderTrack}>
              <View 
                style={[
                  styles.sliderFill, 
                  { 
                    width: `${((controlValues[control.id] - control.min) / (control.max - control.min)) * 100}%` 
                  }
                ]} 
              />
            </View>
            
            <TouchableOpacity
              style={styles.sliderButton}
              onPress={() => {
                const newValue = Math.min(control.max, controlValues[control.id] + (control.max - control.min) / 10);
                setControlValues({
                  ...controlValues,
                  [control.id]: Number(newValue.toFixed(1))
                });
              }}
            >
              <Ionicons name="add" size={20} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>
      );
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
              <Ionicons name="arrow-back" size={24} color="#007AFF" />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.animationContainer}>
          <View style={styles.animationPlaceholder}>
            <ThemedText style={styles.animationPlaceholderText}>
              {isPlaying ? 'Animation Playing' : 'Animation Preview'}
            </ThemedText>
          </View>
          
          <View style={styles.playbackControls}>
            <TouchableOpacity
              style={[styles.playButton, isPlaying && styles.stopButton]}
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
          {animation.controls.map(renderControlItem)}
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
  },
  animationPlaceholder: {
    height: 200,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  animationPlaceholderText: {
    fontSize: 16,
    opacity: 0.7,
  },
  playbackControls: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  stopButton: {
    backgroundColor: '#FF3B30',
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
  },
  controlsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  controlItem: {
    marginBottom: 20,
  },
  controlHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  controlValue: {
    fontSize: 16,
    opacity: 0.7,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  sliderButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  sliderTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    marginBottom: 8,
  },
  optionButtonSelected: {
    backgroundColor: '#007AFF',
  },
  optionText: {
    fontSize: 14,
  },
  optionTextSelected: {
    color: 'white',
  },
});
