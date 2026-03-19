import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  TextInput
} from 'react-native';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, 
         isSameMonth, isSameDay, addMonths, subMonths, getDay, 
         isAfter, isBefore, parseISO, subDays } from 'date-fns';
import { useSyncStore } from '../context/store';
import { colors, typography, spacing, radii, shadows, MOODS, fonts } from '../theme';
import { Icons, MoodIcon } from '../components/Icons';

const { width } = Dimensions.get('window');
const DAY_SIZE = (width - spacing.lg * 2 - spacing.sm * 6) / 7;

export default function TimelineScreen() {
  const { moments } = useSyncStore();
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState('all'); // 'all' | 'week' | 'month' | '3months'

  // Filter moments
  const filteredMoments = useMemo(() => {
    let filtered = [...(moments || [])];
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(m => 
        (m.notes && m.notes.toLowerCase().includes(query)) ||
        format(new Date(m.date), 'MMM d, yyyy').toLowerCase().includes(query)
      );
    }
    
    // Mood filter
    if (selectedMoods.length > 0) {
      filtered = filtered.filter(m => selectedMoods.includes(m.mood));
    }
    
    // Date range filter
    const now = new Date();
    if (dateFilter === 'week') {
      const weekAgo = subDays(now, 7);
      filtered = filtered.filter(m => isAfter(new Date(m.date), weekAgo));
    } else if (dateFilter === 'month') {
      const monthAgo = subDays(now, 30);
      filtered = filtered.filter(m => isAfter(new Date(m.date), monthAgo));
    } else if (dateFilter === '3months') {
      const threeMonthsAgo = subDays(now, 90);
      filtered = filtered.filter(m => isAfter(new Date(m.date), threeMonthsAgo));
    }
    
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [moments, searchQuery, selectedMoods, dateFilter]);

  const sortedMoments = filteredMoments;

  // Calendar calculations (use all moments, not filtered, for the calendar view)
  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });
    
    const startDayOfWeek = getDay(start);
    const paddingDays = Array(startDayOfWeek).fill(null);
    
    return [...paddingDays, ...days];
  }, [currentMonth]);

  const getMomentsForDay = (day) => {
    if (!day) return [];
    return moments.filter(m => isSameDay(new Date(m.date), day));
  };

  const getMoodForDay = (day) => {
    const dayMoments = getMomentsForDay(day);
    if (dayMoments.length === 0) return null;
    const latest = dayMoments.sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    )[0];
    return MOODS.find(m => m.id === latest.mood);
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(direction === 'next' 
      ? addMonths(currentMonth, 1) 
      : subMonths(currentMonth, 1)
    );
    setSelectedDate(null);
  };

  const toggleMoodFilter = (moodId) => {
    setSelectedMoods(prev => 
      prev.includes(moodId)
        ? prev.filter(id => id !== moodId)
        : [...prev, moodId]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedMoods([]);
    setDateFilter('all');
  };

  const hasActiveFilters = searchQuery || selectedMoods.length > 0 || dateFilter !== 'all';

  const renderListView = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      {sortedMoments.length === 0 ? (
        <View style={styles.emptyState}>
          <Icons name={hasActiveFilters ? 'search' : 'empty'} size={48} color={colors.text.muted} style={styles.emptyIcon} />
          <Text style={styles.emptyText}>
            {hasActiveFilters ? 'No moments match your filters' : 'No moments yet'}
          </Text>
          <Text style={styles.emptySubtext}>
            {hasActiveFilters ? 'Try adjusting your search' : 'Tap + to log your first moment'}
          </Text>
          {hasActiveFilters && (
            <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
              <Text style={styles.clearFiltersText}>Clear filters</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <>
          {hasActiveFilters && (
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsText}>
                {sortedMoments.length} result{sortedMoments.length !== 1 ? 's' : ''}
              </Text>
              <TouchableOpacity onPress={clearFilters}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            </View>
          )}
          {sortedMoments.map((moment, index) => {
            const mood = MOODS.find(m => m.id === moment.mood) || MOODS[0];
            return (
              <View key={index} style={styles.momentCard}>
                <View style={styles.momentHeader}>
                  <Text style={styles.momentDate}>
                    {format(new Date(moment.date), 'MMM d, yyyy')}
                  </Text>
                  <View style={[styles.moodBadge, { backgroundColor: mood.color }]}>
                    <MoodIcon moodId={mood.id} size={16} color={colors.text.primary} />
                    <Text style={styles.moodLabel}>{mood.label}</Text>
                  </View>
                </View>
                {moment.notes && (
                  <Text style={styles.momentNotes}>{moment.notes}</Text>
                )}
              </View>
            );
          })}
        </>
      )}
    </ScrollView>
  );

  const renderCalendarView = () => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
      <ScrollView contentContainerStyle={styles.calendarContent}>
        <View style={styles.monthHeader}>
          <TouchableOpacity onPress={() => navigateMonth('prev')}>
            <Text style={styles.navArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.monthTitle}>
            {format(currentMonth, 'MMMM yyyy')}
          </Text>
          <TouchableOpacity onPress={() => navigateMonth('next')}>
            <Text style={styles.navArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.weekHeader}>
          {weekDays.map(day => (
            <Text key={day} style={styles.weekDayText}>{day}</Text>
          ))}
        </View>

        <View style={styles.calendarGrid}>
          {calendarDays.map((day, index) => {
            const mood = day ? getMoodForDay(day) : null;
            const dayMoments = day ? getMomentsForDay(day) : [];
            const isSelected = day && selectedDate && isSameDay(day, selectedDate);
            const isCurrentMonth = day && isSameMonth(day, currentMonth);
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayCell,
                  day && { backgroundColor: colors.card },
                  mood && { backgroundColor: mood.color + '40' },
                  isSelected && styles.dayCellSelected,
                  !isCurrentMonth && styles.dayCellMuted
                ]}
                onPress={() => day && setSelectedDate(day)}
                disabled={!day}
              >
                {day && (
                  <>
                    <Text style={[
                      styles.dayNumber,
                      !isCurrentMonth && styles.dayNumberMuted
                    ]}>
                      {format(day, 'd')}
                    </Text>
                    {dayMoments.length > 0 && (
                      <View style={styles.dayDots}>
                        {dayMoments.slice(0, 3).map((_, i) => (
                          <View 
                            key={i} 
                            style={[
                              styles.dayDot,
                              { backgroundColor: mood?.color || colors.blush[200] }
                            ]} 
                          />
                        ))}
                      </View>
                    )}
                  </>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedDate && (
          <View style={styles.selectedDayPanel}>
            <Text style={styles.selectedDayTitle}>
              {format(selectedDate, 'EEEE, MMMM d')}
            </Text>
            {getMomentsForDay(selectedDate).length === 0 ? (
              <Text style={styles.noMomentsText}>No moments this day</Text>
            ) : (
              getMomentsForDay(selectedDate).map((moment, idx) => {
                const mood = MOODS.find(m => m.id === moment.mood);
                return (
                  <View key={idx} style={styles.selectedMomentCard}>
                    <View style={[styles.selectedMoodBadge, { backgroundColor: mood?.color }]}>
                      <MoodIcon moodId={mood?.id} size={16} color={colors.text.primary} />
                      <Text style={styles.selectedMoodLabel}>{mood?.label}</Text>
                    </View>
                    {moment.notes && (
                      <Text style={styles.selectedNotes}>{moment.notes}</Text>
                    )}
                  </View>
                );
              })
            )}
          </View>
        )}
      </ScrollView>
    );
  };

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Icons name="search" size={18} color={colors.text.muted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search notes or dates..."
          placeholderTextColor={colors.text.muted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icons name="close" size={18} color={colors.text.muted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Date Range Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dateFilterContainer}
      >
        {[
          { id: 'all', label: 'All time' },
          { id: 'week', label: 'Last 7 days' },
          { id: 'month', label: 'Last 30 days' },
          { id: '3months', label: 'Last 3 months' },
        ].map(option => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.dateFilterChip,
              dateFilter === option.id && styles.dateFilterChipActive
            ]}
            onPress={() => setDateFilter(option.id)}
          >
            <Text style={[
              styles.dateFilterText,
              dateFilter === option.id && styles.dateFilterTextActive
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Mood Filter */}
      <Text style={styles.filterLabel}>Filter by mood:</Text>
      <View style={styles.moodFilterContainer}>
        {MOODS.map(mood => (
          <TouchableOpacity
            key={mood.id}
            style={[
              styles.moodFilterChip,
              { backgroundColor: mood.color },
              selectedMoods.includes(mood.id) && styles.moodFilterChipSelected
            ]}
            onPress={() => toggleMoodFilter(mood.id)}
          >
            <MoodIcon moodId={mood.id} size={24} color={colors.text.primary} />
            {selectedMoods.includes(mood.id) && (
              <View style={styles.checkmark}>
                <Icons name="check" size={10} color={colors.text.inverse} />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with View Toggle */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Your Moments</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Icons name="filter" size={18} color={hasActiveFilters ? colors.text.primary : colors.text.muted} />
            {hasActiveFilters && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>
                  {selectedMoods.length + (searchQuery ? 1 : 0) + (dateFilter !== 'all' ? 1 : 0)}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.toggleContainer}>
            <TouchableOpacity 
              style={[styles.toggleButton, viewMode === 'list' && styles.toggleActive]}
              onPress={() => setViewMode('list')}
            >
              <Icons 
                name="list" 
                size={18} 
                color={viewMode === 'list' ? colors.text.primary : colors.text.muted} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleButton, viewMode === 'calendar' && styles.toggleActive]}
              onPress={() => setViewMode('calendar')}
            >
              <Icons 
                name="calendar" 
                size={18} 
                color={viewMode === 'calendar' ? colors.text.primary : colors.text.muted} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Filters Panel */}
      {showFilters && viewMode === 'list' && renderFilters()}

      {viewMode === 'list' ? renderListView() : renderCalendarView()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  header: {
    fontSize: typography.sizes.xl,
    fontFamily: fonts.heading,
    color: colors.text.primary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.md,
    backgroundColor: colors.cream[200],
  },
  filterButtonActive: {
    backgroundColor: colors.blush[200],
  },
  filterBadge: {
    backgroundColor: colors.text.primary,
    borderRadius: radii.full,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.xs,
  },
  filterBadgeText: {
    color: colors.text.inverse,
    fontSize: 10,
    fontWeight: typography.weights.bold,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.cream[200],
    borderRadius: radii.full,
    padding: spacing.xs,
  },
  toggleButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
  },
  toggleActive: {
    backgroundColor: colors.surface,
    ...shadows.soft,
  },
  toggleText: {
    fontSize: 18,
    opacity: 0.5,
  },
  toggleTextActive: {
    opacity: 1,
  },
  // Filters
  filtersContainer: {
    padding: spacing.lg,
    paddingTop: 0,
    backgroundColor: colors.card,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: radii.lg,
    ...shadows.soft,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cream[100],
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: typography.sizes.base,
    color: colors.text.primary,
    fontFamily: fonts.body,
  },
  dateFilterContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  dateFilterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    backgroundColor: colors.cream[200],
  },
  dateFilterChipActive: {
    backgroundColor: colors.blush[200],
  },
  dateFilterText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  dateFilterTextActive: {
    color: colors.text.primary,
    fontWeight: typography.weights.medium,
  },
  filterLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  moodFilterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  moodFilterChip: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  moodFilterChipSelected: {
    borderWidth: 2,
    borderColor: colors.text.primary,
  },
  checkmark: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: colors.text.primary,
    borderRadius: radii.full,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Results
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  resultsText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  clearText: {
    fontSize: typography.sizes.sm,
    color: colors.blush[400],
    fontWeight: typography.weights.medium,
  },
  clearFiltersButton: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.blush[200],
    borderRadius: radii.full,
  },
  clearFiltersText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
  },
  // List view
  scrollContent: {
    padding: spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: spacing['3xl'],
  },
  emptyIcon: {
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: typography.sizes.lg,
    color: colors.text.secondary,
  },
  emptySubtext: {
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
    marginTop: spacing.xs,
  },
  momentCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.soft,
  },
  momentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  momentDate: {
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.md,
  },
  moodLabel: {
    fontSize: typography.sizes.xs,
    fontFamily: fonts.bodyMedium,
    color: colors.text.primary,
    marginLeft: spacing.xs,
  },
  momentNotes: {
    fontSize: typography.sizes.sm,
    fontFamily: fonts.body,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  // Calendar styles
  calendarContent: {
    padding: spacing.lg,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  navArrow: {
    fontSize: 32,
    color: colors.blush[300],
    paddingHorizontal: spacing.md,
  },
  monthTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    fontWeight: typography.weights.medium,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  dayCell: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    borderRadius: radii.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  dayCellSelected: {
    borderWidth: 2,
    borderColor: colors.blush[300],
  },
  dayCellMuted: {
    opacity: 0.3,
  },
  dayNumber: {
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
    fontWeight: typography.weights.medium,
  },
  dayNumberMuted: {
    color: colors.text.muted,
  },
  dayDots: {
    flexDirection: 'row',
    marginTop: 2,
    gap: 2,
  },
  dayDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  selectedDayPanel: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
    ...shadows.soft,
  },
  selectedDayTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  noMomentsText: {
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
    fontStyle: 'italic',
  },
  selectedMomentCard: {
    backgroundColor: colors.background,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  selectedMoodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.md,
    marginBottom: spacing.xs,
  },
  selectedMoodLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    marginLeft: 4,
  },
  selectedNotes: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
});
