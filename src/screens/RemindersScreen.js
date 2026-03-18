import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Switch,
  TouchableOpacity
} from 'react-native';
import { useSyncStore } from '../context/store';
import { colors, typography, spacing, radii } from '../theme';
import { PaperCard, Heading, Body, SoftButton } from '../components/ui';

export const RemindersScreen = () => {
  const { settings, setSettings } = useSyncStore();
  
  const toggleSetting = (key) => {
    setSettings({ [key]: !settings[key] });
  };
  
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Heading size="2xl">Reminders ⏰</Heading>
        <Body size="sm" color="secondary">Stay connected on your schedule</Body>
      </View>
      
      {/* Main toggle */}
      <PaperCard style={styles.mainToggleCard}>
        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleEmoji}>🔔</Text>
            <View>
              <Heading size="sm">Enable reminders</Heading>
              <Body size="xs" color="muted">Get gentle nudges to connect</Body>
            </View>
          </View>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={() => toggleSetting('notificationsEnabled')}
            trackColor={{ false: colors.cream[400], true: colors.blush[200] }}
            thumbColor={settings.notificationsEnabled ? colors.blush[400] : colors.cream[300]}
          />
        </View>
      </PaperCard>
      
      {settings.notificationsEnabled && (
        <>
          {/* Reminder types */}
          
          <Heading size="md" style={styles.sectionTitle}>Reminder types</Heading>
          
          <PaperCard style={styles.toggleCard}>
            <View style={styles.toggleRow}>
              <View style={styles.toggleInfo}>
                <Text style={styles.toggleEmoji}>💝</Text>
                <View>
                  <Heading size="sm">Rhythm check</Heading>
                  <Body size="xs" color="muted">Based on your usual pattern</Body>
                </View>
              </View>
              <Switch
                value={true}
                disabled
                trackColor={{ false: colors.cream[400], true: colors.blush[200] }}
              />
            </View>
          </PaperCard>
          
          <PaperCard style={styles.toggleCard}>
            <View style={styles.toggleRow}>
              <View style={styles.toggleInfo}>
                <Text style={styles.toggleEmoji}>🎯</Text>
                <View>
                  <Heading size="sm">Weekly intention</Heading>
                  <Body size="xs" color="muted">Sunday evening prompts</Body>
                </View>
              </View>
              <Switch
                value={settings.weeklyReminders}
                onValueChange={() => toggleSetting('weeklyReminders')}
                trackColor={{ false: colors.cream[400], true: colors.blush[200] }}
                thumbColor={settings.weeklyReminders ? colors.blush[400] : colors.cream[300]}
              />
            </View>
          </PaperCard>
          
          <PaperCard style={styles.toggleCard}>
            <View style={styles.toggleRow}>
              <View style={styles.toggleInfo}>
                <Text style={styles.toggleEmoji}>🎉</Text>
                <View>
                  <Heading size="sm">Milestones</Heading>
                  <Body size="xs" color="muted">Celebrate achievements</Body>
                </View>
              </View>
              <Switch
                value={settings.milestoneAlerts}
                onValueChange={() => toggleSetting('milestoneAlerts')}
                trackColor={{ false: colors.cream[400], true: colors.blush[200] }}
                thumbColor={settings.milestoneAlerts ? colors.blush[400] : colors.cream[300]}
              />
            </View>
          </PaperCard>
          
          {/* Quiet hours */}
          
          <Heading size="md" style={styles.sectionTitle}>Quiet hours 🌙</Heading>
          
          <PaperCard style={styles.quietHoursCard}>
            <Body size="sm" color="secondary" style={styles.quietHoursText}>
              We won't send notifications during these hours
            </Body>
            
            <View style={styles.timeRow}>
              <View style={styles.timeBlock}>
                <Body size="xs" color="muted">From</Body>
                <TouchableOpacity style={styles.timeButton}>
                  <Heading size="sm">{settings.quietHoursStart}</Heading>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.timeArrow}>→</Text>
              
              <View style={styles.timeBlock}>
                <Body size="xs" color="muted">To</Body>
                <TouchableOpacity style={styles.timeButton}>
                  <Heading size="sm">{settings.quietHoursEnd}</Heading>
                </TouchableOpacity>
              </View>
            </View>
          </PaperCard>
          
          {/* Vacation mode */}
          
          <PaperCard style={styles.toggleCard}>
            <View style={styles.toggleRow}>
              <View style={styles.toggleInfo}>
                <Text style={styles.toggleEmoji}>🏖️</Text>
                <View>
                  <Heading size="sm">Vacation mode</Heading>
                  <Body size="xs" color="muted">Pause all reminders</Body>
                </View>
              </View>
              <Switch
                value={settings.vacationMode}
                onValueChange={() => toggleSetting('vacationMode')}
                trackColor={{ false: colors.cream[400], true: colors.peach[200] }}
                thumbColor={settings.vacationMode ? colors.peach[400] : colors.cream[300]}
              />
            </View>
          </PaperCard>
        </>
      )}
      
      {/* Info */}
      
      <PaperCard style={styles.infoCard}>
        <Text style={styles.infoEmoji}>💡</Text>
        <Body size="xs" color="muted" style={styles.infoText}>
          Reminders are gentle suggestions, not obligations. 
          Take them at your own pace.
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
  mainToggleCard: {
    margin: spacing.md,
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
  },
  toggleEmoji: {
    fontSize: 24,
  },
  sectionTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  toggleCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  quietHoursCard: {
    marginHorizontal: spacing.md,
    padding: spacing.md,
  },
  quietHoursText: {
    marginBottom: spacing.md,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  timeBlock: {
    alignItems: 'center',
  },
  timeButton: {
    backgroundColor: colors.cream[200],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    marginTop: spacing.xs,
  },
  timeArrow: {
    fontSize: 20,
    color: colors.text.muted,
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
  bottomPadding: {
    height: 40,
  },
});
