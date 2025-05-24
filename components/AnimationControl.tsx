import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from './ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

interface AnimationControlProps {
  label: string;
  value: number | string;
  onChange: (value: number | string) => void;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
}

export function AnimationControl({ 
  label, 
  value, 
  onChange, 
  options, 
  min = 0, 
  max = 10, 
  step = 1 
}: AnimationControlProps) {
  const backgroundColor = useThemeColor({ light: '#f0f0f0', dark: '#333333' }, 'background');
  const accentColor = useThemeColor({ light: '#007AFF', dark: '#0A84FF' }, 'tint');
  
  if (options) {
    // Render options selector
    return (
      <View style={styles.controlItem}>
        <View style={styles.controlHeader}>
          <ThemedText style={styles.controlLabel}>{label}</ThemedText>
          <ThemedText style={styles.controlValue}>{value as string}</ThemedText>
        </View>
        <View style={styles.optionsContainer}>
          {options.map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                { backgroundColor: backgroundColor },
                value === option && { backgroundColor: accentColor }
              ]}
              onPress={() => onChange(option)}
            >
              <ThemedText
                style={[
                  styles.optionText,
                  value === option && { color: 'white' }
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
    const percentage = ((value as number) - min) / (max - min) * 100;
    
    return (
      <View style={styles.controlItem}>
        <View style={styles.controlHeader}>
          <ThemedText style={styles.controlLabel}>{label}</ThemedText>
          <ThemedText style={styles.controlValue}>{value}</ThemedText>
        </View>
        <View style={styles.sliderContainer}>
          <TouchableOpacity
            style={[styles.sliderButton, { backgroundColor }]}
            onPress={() => {
              const newValue = Math.max(min, (value as number) - step);
              onChange(Number(newValue.toFixed(1)));
            }}
          >
            <Ionicons name="remove" size={20} color={accentColor} />
          </TouchableOpacity>
          
          <View style={[styles.sliderTrack, { backgroundColor: backgroundColor }]}>
            <View 
              style={[
                styles.sliderFill, 
                { 
                  width: `${percentage}%`,
                  backgroundColor: accentColor 
                }
              ]} 
            />
          </View>
          
          <TouchableOpacity
            style={[styles.sliderButton, { backgroundColor }]}
            onPress={() => {
              const newValue = Math.min(max, (value as number) + step);
              onChange(Number(newValue.toFixed(1)));
            }}
          >
            <Ionicons name="add" size={20} color={accentColor} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  },
  sliderTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
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
    marginRight: 8,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 14,
  },
});
