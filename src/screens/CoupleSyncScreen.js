import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  TextInput
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useSyncStore } from '../context/store';
import { colors, typography, spacing, radii } from '../theme';
import { PaperCard, Heading, Body, SoftButton } from '../components/ui';

export const CoupleSyncScreen = () => {
  const { 
    user, 
    generateCoupleCode, 
    connectPartner, 
    disconnectPartner 
  } = useSyncStore();
  
  const [partnerCode, setPartnerCode] = useState('');
  const [showCopied, setShowCopied] = useState(false);
  
  const handleGenerateCode = () => {
    generateCoupleCode();
  };
  
  const handleCopyCode = async () => {
    if (user.coupleCode) {
      await Clipboard.setStringAsync(user.coupleCode);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };
  
  const handleConnect = () => {
    if (partnerCode.length === 6) {
      connectPartner(partnerCode);
    }
  };
  
  const handleDisconnect = () => {
    disconnectPartner();
  };
  
  if (user.partnerConnected) {
    return (
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Heading size="2xl">Connected 💑</Heading>
          <Body size="sm" color="secondary">You're in sync with {user.partnerName || 'your partner'}</Body>
        </View>
        
        <PaperCard style={styles.connectedCard}>
          <Text style={styles.bigEmoji}>💕</Text>
          <Heading size="lg" style={styles.connectedTitle}>You're synced!</Heading>
          <Body size="sm" color="secondary" style={styles.connectedText}>
            You can now see each other's moments and insights
          </Body>
        </PaperCard>
        
        <PaperCard style={styles.featuresCard}>
          <Heading size="sm" style={styles.featuresTitle}>What you can share:</Heading>
          
          <View style={styles.featureRow}>
            <Text style={styles.featureEmoji}>📊</Text>
            <Body size="sm">Combined timeline</Body>
          </View>
          
          <View style={styles.featureRow}>
            <Text style={styles.featureEmoji}>💡</Text>
            <Body size="sm">Mutual insights</Body>
          </View>
          
          <View style={styles.featureRow}>
            <Text style={styles.featureEmoji}>🎯</Text>
            <Body size="sm">Desire alignment</Body>
          </View>
        </PaperCard>
        
        <PaperCard style={styles.privacyCard}>
          <Text style={styles.privacyEmoji}>🔒</Text>
          <Body size="xs" color="muted" style={styles.privacyText}>
            Private moments are still only visible to you. 
            Toggle privacy when logging a moment.
          </Body>
        </PaperCard>
        
        <View style={styles.disconnectSection}>
          <Body size="xs" color="muted" style={styles.disconnectText}>
            Need to disconnect?
          </Body>
          
          <SoftButton
            title="Disconnect partner"
            variant="outline"
            onPress={handleDisconnect}
          />
        </View>
        
        <View style={styles.bottomPadding} />
      </ScrollView>
    );
  }
  
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Heading size="2xl">Couple Sync 💑</Heading>
        <Body size="sm" color="secondary">Connect with your partner</Body>
      </View>
      
      {/* Generate Code Section */}
      <PaperCard style={styles.codeCard}>
        <Text style={styles.sectionEmoji}>📤</Text>
        <Heading size="md">Share your code</Heading>
        <Body size="sm" color="secondary" style={styles.sectionText}>
          Generate a unique code and share it with your partner
        </Body>
        
        {!user.coupleCode ? (
          <SoftButton
            title="Generate code"
            onPress={handleGenerateCode}
            style={styles.generateButton}
          />
        ) : (
          <TouchableOpacity 
            style={styles.codeDisplay}
            onPress={handleCopyCode}
          >
            <Heading size="xl" style={styles.codeText}>
              {user.coupleCode}
            </Heading>
            <Body size="xs" color="muted">
              {showCopied ? 'Copied! ✓' : 'Tap to copy'}
            </Body>
          </TouchableOpacity>
        )}
      </PaperCard>
      
      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Body size="xs" color="muted">or</Body>
        <View style={styles.dividerLine} />
      </View>
      
      {/* Enter Code Section */}
      
      <PaperCard style={styles.codeCard}>
        <Text style={styles.sectionEmoji}>📥</Text>
        <Heading size="md">Enter partner code</Heading>
        
        <Body size="sm" color="secondary" style={styles.sectionText}>
          Received a code? Enter it below
        </Body>
        
        <TextInput
          style={styles.codeInput}
          value={partnerCode}
          onChangeText={(text) => setPartnerCode(text.toUpperCase().slice(0, 6))}
          placeholder="ABCDEF"
          placeholderTextColor={colors.text.muted}
          autoCapitalize="characters"
          maxLength={6}
        />
        
        <SoftButton
          title="Connect"
          onPress={handleConnect}
          disabled={partnerCode.length !== 6}
        />
      </PaperCard>
      
      {/* Info */}
      
      <PaperCard style={styles.infoCard}>
        <Text style={styles.infoEmoji}>🔒</Text>
        <Body size="xs" color="muted" style={styles.infoText}>
          Your data stays private. Connecting allows you to share 
          timelines and insights. You control what's visible.
        </Body>
      </PaperCard>
      
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingTop: spacing.xl,
  },
  header: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  codeCard: {
    margin: spacing.md,
    padding: spacing.lg,
    alignItems: 'center',
  },
  sectionEmoji: {
    fontSize: 32,
    marginBottom: spacing.md,
  },
  sectionText: {
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  generateButton: {
    width: '100%',
  },
  codeDisplay: {
    backgroundColor: colors.cream[200],
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  codeText: {
    letterSpacing: 4,
    marginBottom: spacing.xs,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginVertical: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.cream[400],
    marginHorizontal: spacing.md,
  },
  codeInput: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    textAlign: 'center',
    letterSpacing: 8,
    backgroundColor: colors.cream[200],
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    width: '100%',
  },
  infoCard: {
    margin: spacing.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.cream[100],
  },
  infoEmoji: {
    fontSize: 20,
  },
  infoText: {
    flex: 1,
  },
  // Connected state styles
  connectedCard: {
    margin: spacing.md,
    padding: spacing.xl,
    alignItems: 'center',
  },
  bigEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  connectedTitle: {
    marginBottom: spacing.sm,
  },
  connectedText: {
    textAlign: 'center',
  },
  featuresCard: {
    margin: spacing.md,
    padding: spacing.lg,
  },
  featuresTitle: {
    marginBottom: spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  featureEmoji: {
    fontSize: 20,
    width: 32,
  },
  privacyCard: {
    margin: spacing.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  privacyEmoji: {
    fontSize: 20,
  },
  privacyText: {
    flex: 1,
  },
  disconnectSection: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  disconnectText: {
    marginBottom: spacing.md,
  },
  bottomPadding: {
    height: 40,
  },
});
