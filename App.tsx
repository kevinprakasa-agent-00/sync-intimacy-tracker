import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  Modal,
  TextInput,
  Switch,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, subDays, startOfMonth, endOfMonth } from 'date-fns';

interface IntimacyLog {
  id: string;
  date: string;
  mood: 'amazing' | 'good' | 'okay' | 'low';
  notes: string;
  timestamp: number;
}

const MOODS = {
  amazing: { emoji: '🔥', color: '#ff6b6b', label: 'Amazing' },
  good: { emoji: '❤️', color: '#4ecdc4', label: 'Good' },
  okay: { emoji: '💙', label: 'Okay' },
  low: { emoji: '💤', color: '#95a5a6', label: 'Low' },
};

const STORAGE_KEY = '@sync_logs';
const SECURITY_ENABLED_KEY = '@sync_security_enabled';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [securityEnabled, setSecurityEnabled] = useState(false);
  const [logs, setLogs] = useState<IntimacyLog[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMood, setSelectedMood] = useState<IntimacyLog['mood']>('good');
  const [notes, setNotes] = useState('');
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar'>('timeline');

  useEffect(() => {
    loadSecuritySetting();
  }, []);

  useEffect(() => {
    if (!securityEnabled || isAuthenticated) {
      loadLogs();
    }
  }, [securityEnabled, isAuthenticated]);

  const loadSecuritySetting = async () => {
    try {
      const enabled = await AsyncStorage.getItem(SECURITY_ENABLED_KEY);
      if (enabled === 'true') {
        setSecurityEnabled(true);
        authenticate();
      } else {
        setSecurityEnabled(false);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error('Failed to load security setting', err);
    }
  };

  const authenticate = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        setIsAuthenticated(true);
        return;
      }

      const { success } = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock SYNC',
        fallbackLabel: 'Use passcode',
      });

      if (success) {
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error('Authentication error', err);
    }
  };

  const toggleSecurity = async () => {
    const newValue = !securityEnabled;
    setSecurityEnabled(newValue);
    await AsyncStorage.setItem(SECURITY_ENABLED_KEY, newValue.toString());
    if (newValue && !isAuthenticated) {
      authenticate();
    }
  };

  const loadLogs = async () => {
    try {
      const stored = await SecureStore.getItemAsync(STORAGE_KEY);
      if (stored) {
        setLogs(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to load logs', err);
    }
  };

  const saveLogs = async (newLogs: IntimacyLog[]) => {
    try {
      await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(newLogs));
    } catch (err) {
      console.error('Failed to save logs', err);
    }
  };

  const addLog = async () => {
    const newLog: IntimacyLog = {
      id: Date.now().toString(),
      date: selectedDate.toISOString().split('T')[0],
      mood: selectedMood,
      notes,
      timestamp: Date.now(),
    };

    const updatedLogs = [...logs.filter(l => l.date !== newLog.date), newLog].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    setLogs(updatedLogs);
    await saveLogs(updatedLogs);
    setModalVisible(false);
    setNotes('');
  };

  const deleteLog = (id: string) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedLogs = logs.filter(l => l.id !== id);
            setLogs(updatedLogs);
            await saveLogs(updatedLogs);
          },
        },
      ]
    );
  };

  const getLogForDate = (date: Date) => {
    return logs.find(l => isSameDay(new Date(l.date), date));
  };

  const getStreak = () => {
    if (logs.length === 0) return 0;
    const sortedDates = logs.map(l => new Date(l.date)).sort((a, b) => b.getTime() - a.getTime());
    let streak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const diff = Math.floor((sortedDates[i-1].getTime() - sortedDates[i].getTime()) / (1000 * 60 * 60 * 24));
      if (diff <= 7) streak++;
      else break;
    }
    return streak;
  };

  const getWeeklyStats = () => {
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());
    const weekLogs = logs.filter(l => {
      const logDate = new Date(l.date);
      return logDate >= weekStart && logDate <= weekEnd;
    });
    return weekLogs.length;
  };

  const getMonthlyStats = () => {
    const monthStart = startOfMonth(new Date());
    const monthEnd = endOfMonth(new Date());
    const monthLogs = logs.filter(l => {
      const logDate = new Date(l.date);
      return logDate >= monthStart && logDate <= monthEnd;
    });
    return monthLogs.length;
  };

  const renderTimeline = () => (
    <ScrollView style={styles.timeline} showsVerticalScrollIndicator={false}>
      {logs.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>💕</Text>
          <Text style={styles.emptyTitle}>No entries yet</Text>
          <Text style={styles.emptyText}>Tap + to log your first moment</Text>
        </View>
      ) : (
        logs.map((log, index) => {
          const isFirstOfMonth = index === 0 || 
            new Date(log.date).getMonth() !== new Date(logs[index-1].date).getMonth();
          
          return (
            <View key={log.id}>
              {isFirstOfMonth && (
                <Text style={styles.monthHeader}>
                  {format(new Date(log.date), 'MMMM yyyy')}
                </Text>
              )}
              <View style={styles.logCard}>
                <View style={styles.logHeader}>
                  <Text style={styles.logDate}>
                    {format(new Date(log.date), 'EEEE, MMM d')}
                  </Text>
                  <TouchableOpacity onPress={() => deleteLog(log.id)}>
                    <Ionicons name="trash-outline" size={18} color="#ff6b6b" />
                  </TouchableOpacity>
                </View>
                <View style={styles.moodRow}>
                  <Text style={styles.moodEmoji}>{MOODS[log.mood].emoji}</Text>
                  <Text style={[styles.moodLabel, { color: MOODS[log.mood].color }]}>
                    {MOODS[log.mood].label}
                  </Text>
                </View>
                {log.notes ? (
                  <Text style={styles.logNotes}>{log.notes}</Text>
                ) : null}
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );

  const renderCalendar = () => {
    const today = new Date();
    const days = eachDayOfInterval({
      start: startOfMonth(today),
      end: endOfMonth(today),
    });

    return (
      <ScrollView style={styles.calendar} showsVerticalScrollIndicator={false}>
        <Text style={styles.calendarMonth}>{format(today, 'MMMM yyyy')}</Text>
        <View style={styles.calendarGrid}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <Text key={i} style={styles.calendarDayLabel}>{day}</Text>
          ))}
          {days.map((date, i) => {
            const log = getLogForDate(date);
            const isToday = isSameDay(date, today);
            return (
              <TouchableOpacity
                key={i}
                style={[
                  styles.calendarDay,
                  isToday && styles.today,
                ]}
                onPress={() => {
                  setSelectedDate(date);
                  if (log) {
                    setSelectedMood(log.mood);
                    setNotes(log.notes);
                  } else {
                    setSelectedMood('good');
                    setNotes('');
                  }
                  setModalVisible(true);
                }}
              >
                <Text style={[
                  styles.calendarDayText,
                  isToday && styles.todayText,
                ]}>
                  {format(date, 'd')}
                </Text>
                {log && (
                  <Text style={styles.calendarMood}>{MOODS[log.mood].emoji}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    );
  };

  if (securityEnabled && !isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.authContainer}>
          <Text style={styles.authEmoji}>🔒</Text>
          <Text style={styles.authTitle}>SYNC is Locked</Text>
          <Text style={styles.authText}>
            Your privacy matters. Use biometrics to unlock.
          </Text>
          <TouchableOpacity style={styles.authButton} onPress={authenticate}>
            <Text style={styles.authButtonText}>Unlock</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>SYNC</Text>
          <Text style={styles.subtitle}>Intimacy Tracker</Text>
        </View>
        <TouchableOpacity onPress={toggleSecurity} style={styles.securityToggle}>
          <Ionicons 
            name={securityEnabled ? "lock-closed" : "lock-open"} 
            size={24} 
            color={securityEnabled ? "#ff6b6b" : "#999"} 
          />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{getStreak()}</Text>
          <Text style={styles.statLabel}>Week Streak</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{getWeeklyStats()}</Text>
          <Text style={styles.statLabel}>This Week</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{getMonthlyStats()}</Text>
          <Text style={styles.statLabel}>This Month</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{logs.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      {/* View Toggle */}
      <View style={styles.viewToggle}>
        <TouchableOpacity
          style={[styles.viewButton, viewMode === 'timeline' && styles.viewButtonActive]}
          onPress={() => setViewMode('timeline')}
        >
          <Text style={[styles.viewButtonText, viewMode === 'timeline' && styles.viewButtonTextActive]}>
            Timeline
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewButton, viewMode === 'calendar' && styles.viewButtonActive]}
          onPress={() => setViewMode('calendar')}
        >
          <Text style={[styles.viewButtonText, viewMode === 'calendar' && styles.viewButtonTextActive]}>
            Calendar
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {viewMode === 'timeline' ? renderTimeline() : renderCalendar()}

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setSelectedDate(new Date());
          setSelectedMood('good');
          setNotes('');
          setModalVisible(true);
        }}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Add Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {getLogForDate(selectedDate) ? 'Edit Entry' : 'Log Moment'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDate}>
              {format(selectedDate, 'EEEE, MMMM d')}
            </Text>

            <Text style={styles.moodLabelInput}>How was it?</Text>
            <View style={styles.moodSelector}>
              {(Object.keys(MOODS) as IntimacyLog['mood'][]).map((mood) => (
                <TouchableOpacity
                  key={mood}
                  style={[
                    styles.moodOption,
                    selectedMood === mood && styles.moodOptionSelected,
                  ]}
                  onPress={() => setSelectedMood(mood)}
                >
                  <Text style={styles.moodOptionEmoji}>{MOODS[mood].emoji}</Text>
                  <Text style={[
                    styles.moodOptionLabel,
                    selectedMood === mood && { color: MOODS[mood].color },
                  ]}>
                    {MOODS[mood].label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.notesLabel}>Notes (optional)</Text>
            <TextInput
              style={styles.notesInput}
              multiline
              placeholder="Add any thoughts..."
              placeholderTextColor="#999"
              value={notes}
              onChangeText={setNotes}
            />

            <TouchableOpacity style={styles.saveButton} onPress={addLog}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  authEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  authTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  authText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  authButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 14,
    color: '#ff6b6b',
    fontWeight: '500',
  },
  securityToggle: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ff6b6b',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  viewToggle: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 4,
  },
  viewButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewButtonActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  viewButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  viewButtonTextActive: {
    color: '#ff6b6b',
    fontWeight: '600',
  },
  timeline: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
  monthHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
    marginTop: 8,
  },
  logCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  logDate: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  moodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  moodEmoji: {
    fontSize: 24,
  },
  moodLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  logNotes: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginTop: 4,
  },
  calendar: {
    flex: 1,
    padding: 20,
  },
  calendarMonth: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 20,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDayLabel: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
    marginBottom: 10,
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 4,
  },
  today: {
    backgroundColor: '#ff6b6b',
  },
  calendarDayText: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  todayText: {
    color: '#fff',
    fontWeight: '600',
  },
  calendarMood: {
    fontSize: 12,
    marginTop: 2,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  modalDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  moodLabelInput: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  moodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  moodOption: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f8f8f8',
    flex: 1,
    marginHorizontal: 4,
  },
  moodOptionSelected: {
    backgroundColor: '#fff0f0',
    borderWidth: 2,
    borderColor: '#ff6b6b',
  },
  moodOptionEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodOptionLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  notesInput: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1a1a1a',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#ff6b6b',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
