import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  TextInput
} from 'react-native';
import { useSyncStore } from '../context/store';
import { colors, typography, spacing, radii } from '../theme';
import { PaperCard, Heading, Body, SoftButton } from '../components/ui';

export const SettingsScreen = () => {
  const { 
    user, 
    setUser, 
    resetStore,
    moments
  } = useSyncStore();
  
  const [name, setName] = useState(user.name || '');
  const [partnerName, setPartnerName] = useState(user.partnerName || '');
  const [showExport, setShowExport] = useState(false);
  
  const handleSaveNames = () => {
    setUser({ name, partnerName });
  };
  
  const handleExport = () => {
    const data = {
      exportDate: new Date().toISOString(),
      moments: moments,
      stats: {
        total: moments.length,
        dateRange: moments.length > 0 ? {
          first: moments[moments.length - 1]?.date,
          last: moments[0]?.date,
        } : null,
      }
    };
    
    // In a real app, this would save to file
    console.log('Export data:', JSON.stringify(data, null, 2));
    Alert.alert('Export ready', 'Your data has been prepared for export');
  };
  
  const handleReset = () => {
    Alert.alert(
      'Reset all data?',
      'This will delete all your moments and settings. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            resetStore();
            Alert.alert('Data reset', 'All data has been cleared');
          }
        },
      ]
    );
  };
  
  const handleBreakup = () => {
    Alert.alert(
      'Clean breakup?',
      'This will disconnect your partner and remove all shared data. Your private moments will remain.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Disconnect', 
          style: 'destructive',
          onPress: () => {
            // Handle breakup logic
            Alert.alert('Disconnected', 'Partner has been removed');
          }
        },
      ]
    );
  };
  
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Heading size="2xl">Settings ⚙️</Heading>
        <Body size="sm" color="secondary">Customize your experience</Body>
      </View>
      
      {/* Profile */}
      <Heading size="md" style={styles.sectionTitle}>Profile</Heading>
      
      <PaperCard style={styles.profileCard}>
        <Body size="xs" color="muted" style={styles.inputLabel}>Your name</Body>
        <TextInput
          style={styles.textInput}
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          placeholderTextColor={colors.text.muted}
        />
        
        <Body size="xs" color="muted" style={[styles.inputLabel, { marginTop: spacing.md }]}>Partner's name</Body>
        <TextInput
          style={styles.textInput}
          value={partnerName}
          onChangeText={setPartnerName}
          placeholder="Partner's name"
          placeholderTextColor={colors.text.muted}
        />
        
        <SoftButton
          title="Save names"
          onPress={handleSaveNames}
          size="sm"
          style={{ marginTop: spacing.md }}
        />
      </PaperCard>
      
      {/* Privacy */}
      
      <Heading size="md" style={styles.sectionTitle}>Privacy & Security</Heading>
      
      <PaperCard style={styles.toggleCard}>
        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleEmoji}>🔐</Text>
            <View>
              <Heading size="sm">Biometric lock</Heading>
              <Body size="xs" color="muted">Require fingerprint/face to open</Body>
            </View>
          </View>
          <Switch
            value={user.biometricEnabled}
            onValueChange={(v) => setUser({ biometricEnabled: v })}
            trackColor={{ false: colors.cream[400], true: colors.blush[200] }}
            thumbColor={user.biometricEnabled ? colors.blush[400] : colors.cream[300]}
          />
        </View>
      </PaperCard>
      
      <PaperCard style={styles.toggleCard}>
        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleEmoji}>🎭</Text>
            <View>
              <Heading size="sm">Discreet icon</Heading>
              <Body size="xs" color="muted">Hide the app icon</Body>
            </View>
          </View>
          <Switch
            value={user.discreetMode}
            onValueChange={(v) => setUser({ discreetMode: v })}
            trackColor={{ false: colors.cream[400], true: colors.blush[200] }}
            thumbColor={user.discreetMode ? colors.blush[400] : colors.cream[300]}
          />
        </View>
      </PaperCard>
      
      {/* Data */}
      
      <Heading size="md" style={styles.sectionTitle}>Data</Heading>
      
      <PaperCard style={styles.dataCard}>
        <TouchableOpacity 
          style={styles.dataRow}
          onPress={() => setShowExport(!showExport)}
        >
          <View style={styles.dataInfo}>
            <Text style={styles.dataEmoji}>📤</Text>
            <Heading size="sm">Export data</Heading>
          </View>
          <Text style={styles.arrow}>{showExport ? '▼' : '▶'}</Text>
        </TouchableOpacity>
        
        {showExport && (
          <View style={styles.exportContent}>
            <Body size="xs" color="muted" style={styles.exportText}>
              Export all your moments as a JSON file. 
              Keep it somewhere safe!
            </Body>
            <SoftButton
              title="Export now"
              onPress={handleExport}
              size="sm"
              style={{ marginTop: spacing.sm }}
            />
          </View>
        )}
      </PaperCard>
      
      <PaperCard style={styles.dangerCard}>
        <TouchableOpacity style={styles.dataRow} onPress={handleReset}>
          <View style={styles.dataInfo}>
            <Text style={[styles.dataEmoji, { color: colors.error }]}>🗑️</Text>
            <Heading size="sm" style={{ color: colors.error }}>Delete all data</Heading>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </PaperCard>
      
      {user.partnerConnected && (
        <PaperCard style={styles.dangerCard}>
          <TouchableOpacity style={styles.dataRow} onPress={handleBreakup}>
            <View style={styles.dataInfo}>
              <Text style={[styles.dataEmoji, { color: colors.error }]}>💔</Text>
              <Heading size="sm" style={{ color: colors.error }}>Clean breakup</Heading>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </PaperCard>
      )}
      
      {/* About */}
      
      <View style={styles.aboutSection}>
        <Text style={styles.logoEmoji}>💕</Text>
        <Heading size="sm">Sync</Heading>
        <Body size="xs" color="muted">Version 1.0.0</Body>
        
        <Body size="xs" color="muted" style={styles.aboutText}>
          Made with love for couples everywhere 💕
        </Body>
      </View>
      
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
  sectionTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  profileCard: {
    marginHorizontal: spacing.md,
    padding: spacing.lg,
  },
  inputLabel: {
    marginBottom: spacing.xs,
  },
  textInput: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.base,
    color: colors.text.primary,
    backgroundColor: colors.cream[200],
    borderRadius: radii.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  toggleCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  toggleEmoji: {
    fontSize: 24,
  },
  dataCard: {
    marginHorizontal: spacing.md,
    padding: spacing.md,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dataInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  dataEmoji: {
    fontSize: 24,
  },
  arrow: {
    fontSize: 16,
    color: colors.text.muted,
  },
  exportContent: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.cream[400],
  },
  exportText: {
    marginBottom: spacing.sm,
  },
  dangerCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.error + '10',
  },
  aboutSection: {
    alignItems: 'center',
    marginTop: spacing['3xl'],
    marginBottom: spacing.xl,
  },
  logoEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  aboutText: {
    marginTop: spacing.sm,
  },
  bottomPadding: {
    height: 40,
  },
});
