import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DECK_CARDS, DECK_CATEGORIES } from '../data/deckCards';
import { colors, typography, spacing, radii, fonts } from '../theme';
import { Icons } from '../components/Icons';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;

export default function YesNoMaybeDeckScreen() {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const currentCard = DECK_CARDS[currentIndex];
  const progress = ((currentIndex) / DECK_CARDS.length) * 100;

  const handleAnswer = (answer) => {
    if (currentCard) {
      setAnswers({ ...answers, [currentCard.id]: answer });
    }
    
    if (currentIndex < DECK_CARDS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const getCategoryColor = (categoryId) => {
    const category = DECK_CATEGORIES.find(c => c.id === categoryId);
    return category?.color || colors.blush[200];
  };

  const getMatches = () => {
    // In real app, this would compare with partner's answers
    // For now, show all "yes" and "maybe" cards as potential matches
    return DECK_CARDS.filter(card => {
      const answer = answers[card.id];
      return answer === 'yes' || answer === 'maybe';
    });
  };

  if (showResults) {
    const matches = getMatches();
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.resultsHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icons name="close" size={24} color={colors.text.secondary} />
          </TouchableOpacity>
          <Text style={styles.resultsTitle}>Your Matches</Text>
          <View style={{ width: 24 }} />
        </View>

        <Text style={styles.resultsSubtitle}>
          {matches.length} ideas you might enjoy together
        </Text>

        <View style={styles.matchesContainer}>
          {matches.length === 0 ? (
            <View style={styles.emptyState}>
              <Icons name="empty" size={48} color={colors.text.muted} />
              <Text style={styles.emptyText}>No matches yet</Text>
              <Text style={styles.emptySubtext}>Try the deck again!</Text>
            </View>
          ) : (
            matches.map((card, index) => (
              <View key={card.id} style={[styles.matchCard, { backgroundColor: getCategoryColor(card.category) }]}>
                <View style={styles.matchHeader}>
                  <Text style={styles.matchCategory}>
                    {DECK_CATEGORIES.find(c => c.id === card.category)?.label}
                  </Text>
                  {answers[card.id] === 'maybe' && (
                    <View style={styles.maybeBadge}>
                      <Text style={styles.maybeText}>Curious</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.matchTitle}>{card.title}</Text>
                <Text style={styles.matchDescription}>{card.description}</Text>
                <View style={styles.intensityRow}>
                  <Text style={styles.intensityLabel}>Intensity:</Text>
                  <View style={styles.intensityDots}>
                    {[1, 2, 3].map(level => (
                      <View
                        key={level}
                        style={[
                          styles.intensityDot,
                          level <= card.intensity && styles.intensityDotActive
                        ]}
                      />
                    ))}
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        <TouchableOpacity 
          style={styles.restartButton}
          onPress={() => {
            setCurrentIndex(0);
            setAnswers({});
            setShowResults(false);
          }}
        >
          <Text style={styles.restartButtonText}>Start Over</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!currentCard) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No more cards!</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icons name="close" size={24} color={colors.text.secondary} />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{currentIndex + 1} / {DECK_CARDS.length}</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      {/* Category Badge */}
      <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(currentCard.category) }]}>
        <Text style={styles.categoryText}>
          {DECK_CATEGORIES.find(c => c.id === currentCard.category)?.label}
        </Text>
      </View>

      {/* Card */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{currentCard.title}</Text>
          <Text style={styles.cardDescription}>{currentCard.description}</Text>
          
          <View style={styles.intensityRow}>
            <Text style={styles.intensityLabel}>Intensity:</Text>
            <View style={styles.intensityDots}>
              {[1, 2, 3].map(level => (
                <View
                  key={level}
                  style={[
                    styles.intensityDot,
                    level <= currentCard.intensity && styles.intensityDotActive
                  ]}
                />
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Answer Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.noButton]}
          onPress={() => handleAnswer('no')}
        >
          <Icons name="close" size={28} color={colors.error} />
          <Text style={[styles.buttonText, styles.noButtonText]}>No</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.maybeButton]}
          onPress={() => handleAnswer('maybe')}
        >
          <Text style={styles.maybeEmoji}>🤔</Text>
          <Text style={[styles.buttonText, styles.maybeButtonText]}>Maybe</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.yesButton]}
          onPress={() => handleAnswer('yes')}
        >
          <Icons name="check" size={28} color={colors.success} />
          <Text style={[styles.buttonText, styles.yesButtonText]}>Yes</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.hintText}>Tap to answer</Text>
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
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: spacing.md,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: colors.cream[300],
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.blush[300],
    borderRadius: 3,
  },
  progressText: {
    fontFamily: fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    marginTop: spacing.xs,
  },
  categoryBadge: {
    alignSelf: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    marginTop: spacing.lg,
  },
  categoryText: {
    fontFamily: fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.xl,
    minHeight: 300,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.rose[200],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  cardTitle: {
    fontFamily: fonts.bold,
    fontSize: typography.sizes.xl,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  cardDescription: {
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
  intensityLabel: {
    fontFamily: fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
  },
  intensityDots: {
    flexDirection: 'row',
    gap: 4,
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
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.lg,
  },
  button: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 3,
  },
  noButton: {
    borderColor: colors.error + '40',
  },
  maybeButton: {
    borderColor: colors.peach[300],
  },
  yesButton: {
    borderColor: colors.success + '40',
  },
  buttonText: {
    fontFamily: fonts.medium,
    fontSize: typography.sizes.sm,
    marginTop: spacing.xs,
  },
  noButtonText: {
    color: colors.error,
  },
  maybeButtonText: {
    color: colors.text.secondary,
  },
  yesButtonText: {
    color: colors.success,
  },
  maybeEmoji: {
    fontSize: 28,
  },
  hintText: {
    fontFamily: fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
    textAlign: 'center',
    paddingBottom: spacing.lg,
  },
  // Results styles
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  resultsTitle: {
    fontFamily: fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
  },
  resultsSubtitle: {
    fontFamily: fonts.regular,
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  matchesContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  matchCard: {
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  matchCategory: {
    fontFamily: fonts.medium,
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  maybeBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.md,
  },
  maybeText: {
    fontFamily: fonts.medium,
    fontSize: typography.sizes.xs,
    color: colors.text.primary,
  },
  matchTitle: {
    fontFamily: fonts.bold,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  matchDescription: {
    fontFamily: fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: fonts.medium,
    fontSize: typography.sizes.lg,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontFamily: fonts.regular,
    fontSize: typography.sizes.base,
    color: colors.text.muted,
    marginTop: spacing.xs,
  },
  restartButton: {
    backgroundColor: colors.blush[200],
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radii.full,
    alignItems: 'center',
  },
  restartButtonText: {
    fontFamily: fonts.semibold,
    fontSize: typography.sizes.base,
    color: colors.text.primary,
  },
});
