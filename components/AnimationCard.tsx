import React from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

interface AnimationCardProps {
  id: string;
  title: string;
  description: string;
  type: string;
  previewIcon: string;
}

export function AnimationCard({ id, title, description, type, previewIcon }: AnimationCardProps) {
  const router = useRouter();
  const backgroundColor = useThemeColor({ light: '#f0f0f0', dark: '#333333' }, 'background');
  const textColor = useThemeColor({ light: '#000000', dark: '#ffffff' }, 'text');
  const accentColor = useThemeColor({ light: '#007AFF', dark: '#0A84FF' }, 'tint');

  // Map animation types to appropriate icons
  const getTypeIcon = () => {
    switch (type) {
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
    <TouchableOpacity
      style={[styles.container, { backgroundColor }]}
      onPress={() => router.push(`/animation-detail/${id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={getTypeIcon()} size={32} color={accentColor} />
      </View>
      <View style={styles.content}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText style={styles.description} numberOfLines={2}>
          {description}
        </ThemedText>
        <View style={styles.footer}>
          <View style={[styles.typeTag, { backgroundColor: accentColor + '20' }]}>
            <ThemedText style={[styles.typeText, { color: accentColor }]}>
              {type}
            </ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={16} color={textColor + '80'} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
    opacity: 0.8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
