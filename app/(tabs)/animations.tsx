import { StyleSheet, FlatList, View } from 'react-native';
import React from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AnimationCard } from '@/components/AnimationCard';

// Animation data that will be displayed in the list
const ANIMATIONS = [
  {
    id: 'board-completed',
    title: 'Board Completed',
    description: 'A celebratory fireworks animation for completing a board',
    type: 'fireworks',
    previewIcon: 'sparkles'
  },
  {
    id: 'high-score',
    title: 'High Score',
    description: 'Animation to celebrate achieving a high score',
    type: 'celebration',
    previewIcon: 'trophy'
  },
  {
    id: 'on-fire',
    title: 'You\'re On Fire',
    description: 'Animation to show the user is on a winning streak',
    type: 'flame',
    previewIcon: 'flame'
  },
];

export default function AnimationsScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Animation Showcase</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Browse and preview animations for your indie apps
        </ThemedText>
      </View>
      
      <FlatList
        data={ANIMATIONS}
        renderItem={({ item }) => (
          <AnimationCard
            id={item.id}
            title={item.title}
            description={item.description}
            type={item.type}
            previewIcon={item.previewIcon}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    padding: 16,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  listContent: {
    padding: 16,
  },
});
