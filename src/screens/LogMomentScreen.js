import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSyncStore } from '../context/store';
import { colors, typography, spacing, radii, shadows, MOODS } from '../theme';

export default function LogMomentScreen() {
  const navigation = useNavigation();
  const { addMoment } = useSyncStore();
  const [selectedMood, setSelectedMood] = useState(null);
  const [notes, setNotes] = useState('');
  
  const handleSave = () => {
    if (!selectedMood) return;
    
    addMoment({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mood: selectedMood,
      notes: notes.trim() || null,
    });
    
    navigation.goBack();
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Log Moment</Text>
        <TouchableOpacity 
          onPress={handleSave}
          disabled={!selectedMood}
          style={[styles.saveButton, !selectedMood && styles.saveButtonDisabled]}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>How did it feel?</Text>
        
        <View style={styles.moodsContainer}>
          {MOODS.map((mood) => (
            <TouchableOpacity
              key={mood.id}
              style={[
                styles.moodButton,
                selectedMood === mood.id && { backgroundColor: mood.color }
              ]}
              onPress={() => setSelectedMood(mood.id)}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text style={styles.moodLabel}>{mood.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <Text style={styles.sectionTitle}>Notes (optional)</Text>
        
        <TextInput
          style={styles.notesInput}
          multiline
          numberOfLines={4}
          placeholder="What made this moment special?"
          placeholderTextColor={colors.text.muted}
          value={notes}
          onChangeText={setNotes}
          maxLength={500}
        />
        
        <Text style={styles.charCount}>{notes.length}/500</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: Platform.OS === 'web' ? 20 : 60,
    borderBottomWidth: 1,
    borderBottomColor: colors.cream[300],
  },
  closeButton: {
    fontSize: 24,
    color: colors.text.secondary,
    width: 40,
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  saveButton: {
    backgroundColor: colors.blush[200],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    width: 60,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: colors.cream[300],
  },
  saveButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  moodsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  moodButton: {
    width: '23%',
    aspectRatio: 1,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    justifyContent: 'center',
    alignItems: 'center',
    margin: '1%',
    ...shadows.soft,
  },
  moodEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  notesInput: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.md,
    minHeight: 120,
    textAlignVertical: 'top',
    fontSize: typography.sizes.base,
    color: colors.text.primary,
    ...shadows.soft,
  },
  charCount: {
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
});
