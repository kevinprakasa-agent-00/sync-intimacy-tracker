import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DECK_CARDS, DECK_CATEGORIES } from '../data/deckCards';
import { colors, typography, spacing, radii, fonts } from '../theme';
import { Icons } from '../components/Icons';

const { width } = Dimensions.get('window');

// Tips for each category
const CATEGORY_TIPS = {
  sensory: [
    'Start slow and build anticipation',
    'Focus on one sense at a time',
    'Communicate what feels good',
    'Use temperature to heighten sensations',
  ],
  roleplay: [
    'Set the scene beforehand',
    'Use costumes or props to get into character',
    'Stay in character but check in if needed',
    'Laugh and have fun with it',
  ],
  power: [
    'Establish a safe word first',
    'Start with light commands',
    'The submissive partner is really in control',
    'Aftercare is essential',
  ],
  location: [
    'Check for privacy first',
    'Bring a blanket or towel',
    'Keep it quick if risky',
    'The thrill is in the novelty',
  ],
  teasing: [
    'Draw it out longer than expected',
    'Use your voice to tease',
    'Denial makes the reward sweeter',
    'Watch their reactions closely',
  ],
  toys: [
    'Start on the lowest setting',
    'Use plenty of lube',
    'Clean toys before and after',
    'Focus on pleasure, not performance',
  ],
};

export default function TonightsIdeaScreen() {
  const navigation = useNavigation();
  const [intensity, setIntensity] = useState(2); // 1 = gentle, 2 = moderate, 3 = adventurous
  const [currentIdea, setCurrentIdea] = useState(null);
  const [showingIdea, setShowingIdea] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  // In a real app, this would filter based on the couple's Yes/Maybe answers
  // For now, we'll use all cards
  const getRandomIdea = useCallback(() => {
    const filteredCards = DECK_CARDS.filter(card => card.intensity <= intensity);
    
    if (filteredCards.length === 0) {
      // If no cards match, include all
      const randomCard = DECK_CARDS[Math.floor(Math.random() * DECK_CARDS.length)];
      return randomCard;
    }
    
    const randomCard = filteredCards[Math.floor(Math.random() * filteredCards.length)];
    return randomCard;
  }, [intensity]);

  const generateIdea = () => {
    const idea = getRandomIdea();
    setCurrentIdea(idea);
    setShowingIdea(true);
    
    // Fade in animation
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const getIntensityLabel = () => {
    switch (intensity) {
      case 1: return 'Gentle';
      case 2: return 'Moderate';
      case 3: return 'Adventurous';
      default: return 'Moderate';
    }
  };

  const getCategoryColor = (categoryId) => {
    const category = DECK_CATEGORIES.find(c => c.id === categoryId);
    return category?.color || colors.blush[200];
  };

  const getRandomTip = (category) => {
    const tips = CATEGORY_TIPS[category] || ['Have fun and communicate!'];
    return tips[Math.floor(Math.random() * tips.length)];
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icons name="close" size={24} color={colors.text.secondary} />
        </TouchableOpacity>
        <Text style={styles.title}>Tonight's Idea</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {!showingIdea ? (
          <>
            {/* Intensity Selector */}
            <View style={styles.intensitySection}>
              <Text style={styles.intensityLabel}>What mood are you in?</Text>
              <Text style={styles.intensityValue}>{getIntensityLabel()}</Text>
              
              <View style={styles.intensityButtons}>
                {[1, 2, 3].map(level => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.intensityButton,
                      intensity === level && styles.intensityButtonActive
                    ]}
                    onPress={() => setIntensity(level)}
                  >
                    <View style={styles.intensityDots}>
                      {Array.from({ length: level }).map((_, i) => (
                        <View
                          key={i}
                          style={[
                            styles.intensityDot,
                            intensity === level && styles.intensityDotActive
                          ]}
                        />
                      ))}
                    </View>
                    <Text style={[
                      styles.intensityButtonText,
                      intensity === level && styles.intensityButtonTextActive
                    ]}>
                      {level === 1 && 'Gentle'}
                      {level === 2 && 'Moderate'}
                      {level === 3 && 'Adventurous'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Generate Button */}
            <TouchableOpacity
              style={styles.generateButton}
              onPress={generateIdea}
            >
              <Icons name="sparkles" size={32} color={colors.text.primary} />
              <Text style={styles.generateButtonText}>Surprise Me</Text>
              <Text style={styles.generateButtonSubtext}>Get a random exploration idea</Text>
            </TouchableOpacity>

            {/* Quick Access from Deck */}
            <TouchableOpacity
              style={styles.deckButton}
              onPress={() => navigation.navigate('YesNoMaybeDeck')}
            >
              <Text style={styles.deckButtonText}>Browse All Cards</Text>
              <Icons name="chevronRight" size={20} color={colors.text.muted} />
            </TouchableOpacity>
          </>
        ) : (
          <Animated.View style={[styles.ideaContainer, { opacity: fadeAnim }]}>
            {currentIdea && (
              <>
                <View style={styles.ideaCard}>
                  <View style={[
                    styles.categoryBadge,
                    { backgroundColor: getCategoryColor(currentIdea.category) }
                  ]}>
                    <Text style={styles.categoryText}>
                      {DECK_CATEGORIES.find(c => c.id === currentIdea.category)?.label}
                    </Text>
                  </View>

                  <Text style={styles.ideaTitle}>{currentIdea.title}</Text>
                  <Text style={styles.ideaDescription}>{currentIdea.description}</Text>

                  <View style={styles.intensityRow}>
                    <Text style={styles.intensityRowLabel}>Intensity:</Text>
                    <View style={styles.intensityDots}>
                      {[1, 2, 3].map(level => (
                        <View
                          key={level}
                          style={[
                            styles.intensityDotLarge,
                            level <= currentIdea.intensity && styles.intensityDotLargeActive
                          ]}
                        />
                      ))}
                    </View>
                  </View>
                </View>

                <View style={styles.tipCard}>
                  <Icons name="joy" size={20} color={colors.blush[400]} style={styles.tipIcon} />
                  <Text style={styles.tipText}>{getRandomTip(currentIdea.category)}</Text>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.tryAnotherButton}
                    onPress={generateIdea}
                  >
                    <Icons name="zap" size={20} color={colors.text.primary} />
                    <Text style={styles.tryAnotherText}>Try Another</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.doneButton}
                    onPress={() => navigation.goBack()}
                  >
                    <Text style={styles.doneButtonText}>Let's Do This!</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  // Intensity Selector
  intensitySection: {
    marginBottom: spacing.xl,
  },
  intensityLabel: {
    fontFamily: fonts.regular,
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  intensityValue: {
    fontFamily: fonts.bold,
    fontSize: typography.sizes.xl,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  intensityButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
  },
  intensityButton: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 90,
  },
  intensityButtonActive: {
    borderColor: colors.blush[300],
  },
  intensityDots: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: spacing.xs,
  },
  intensityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.cream[300],
  },
  intensityDotActive: {
    backgroundColor: colors.blush[300],
  },
  intensityButtonText: {
    fontFamily: fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
  },
  intensityButtonTextActive: {
    fontFamily: fonts.medium,
    color: colors.text.primary,
  },
  // Generate Button
  generateButton: {
    backgroundColor: colors.blush[200],
    borderRadius: radii.xl,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  generateButtonText: {
    fontFamily: fonts.bold,
    fontSize: typography.sizes.xl,
    color: colors.text.primary,
    marginTop: spacing.md,
  },
  generateButtonSubtext: {
    fontFamily: fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  // Deck Button
  deckButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  deckButtonText: {
    fontFamily: fonts.medium,
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    marginRight: spacing.sm,
  },
  // Idea Display
  ideaContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  ideaCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.xl,
    alignItems: 'center',
    shadowColor: colors.rose[200],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    marginBottom: spacing.lg,
  },
  categoryBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    marginBottom: spacing.lg,
  },
  categoryText: {
    fontFamily: fonts.medium,
    fontSize: typography.sizes.xs,
    color: colors.text.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  ideaTitle: {
    fontFamily: fonts.bold,
    fontSize: typography.sizes['2xl'],
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  ideaDescription: {
    fontFamily: fonts.regular,
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  intensityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  intensityRowLabel: {
    fontFamily: fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
  },
  intensityDotLarge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.cream[300],
    marginHorizontal: 2,
  },
  intensityDotLargeActive: {
    backgroundColor: colors.blush[300],
  },
  // Tip Card
  tipCard: {
    backgroundColor: colors.peach[100],
    borderRadius: radii.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  tipIcon: {
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  // Action Buttons
  actionButtons: {
    gap: spacing.md,
  },
  tryAnotherButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    gap: spacing.sm,
  },
  tryAnotherText: {
    fontFamily: fonts.medium,
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
  },
  doneButton: {
    backgroundColor: colors.blush[200],
    borderRadius: radii.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  doneButtonText: {
    fontFamily: fonts.semibold,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
  },
});
