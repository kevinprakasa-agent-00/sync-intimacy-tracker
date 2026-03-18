import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';

// Format dates for display
export const formatDate = (dateString) => {
  const date = parseISO(dateString);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d, yyyy');
};

export const formatRelativeTime = (dateString) => {
  return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
};

export const formatTime = (dateString) => {
  return format(parseISO(dateString), 'h:mm a');
};

// Get initials for avatar
export const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

// Generate a unique ID
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Deep clone
export const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

// Debounce function
export const debounce = (fn, ms) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
};

// Validate couple code format
export const isValidCoupleCode = (code) => {
  return /^[A-HJ-NP-Z2-9]{6}$/.test(code);
};

// Mask sensitive text
export const maskText = (text, visibleChars = 3) => {
  if (!text || text.length <= visibleChars) return text;
  return text.slice(0, visibleChars) + '•'.repeat(text.length - visibleChars);
};

// Get ordinal suffix
export const getOrdinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

// Sleep utility
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Random rotation for polaroid effect
export const getRandomRotation = () => {
  return (Math.random() - 0.5) * 6; // -3 to 3 degrees
};

// Truncate text
export const truncate = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

// Group moments by month
export const groupByMonth = (moments) => {
  const grouped = {};
  moments.forEach(moment => {
    const date = parseISO(moment.date);
    const key = format(date, 'MMMM yyyy');
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(moment);
  });
  return grouped;
};

// Calculate patterns
export const calculatePatterns = (moments) => {
  if (moments.length < 3) return [];
  
  const patterns = [];
  const hours = moments.map(m => new Date(m.date).getHours());
  const avgHour = hours.reduce((a, b) => a + b, 0) / hours.length;
  
  // Time of day pattern
  if (avgHour >= 22 || avgHour <= 2) {
    patterns.push({
      type: 'night_owls',
      title: 'Night Owls',
      description: 'You tend to connect more in the evening hours',
      icon: '🌙',
    });
  } else if (avgHour >= 6 && avgHour <= 10) {
    patterns.push({
      type: 'early_birds',
      title: 'Early Birds',
      description: 'Morning moments are your favorite',
      icon: '🌅',
    });
  }
  
  // Weekend pattern
  const weekendDays = moments.filter(m => {
    const day = new Date(m.date).getDay();
    return day === 0 || day === 6;
  }).length;
  const weekendRatio = weekendDays / moments.length;
  
  if (weekendRatio > 0.6) {
    patterns.push({
      type: 'weekend_warriors',
      title: 'Weekend Warriors',
      description: 'You save special moments for weekends',
      icon: '🏖️',
    });
  } else if (weekendRatio < 0.3) {
    patterns.push({
      type: 'weekday_connectors',
      title: 'Weekday Connectors',
      description: 'You find intimacy in everyday moments',
      icon: '📅',
    });
  }
  
  return patterns;
};
