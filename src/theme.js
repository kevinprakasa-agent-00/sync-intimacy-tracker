// Sync App - Theme Configuration
// Soft, handcrafted aesthetic - no neon, no slick gradients

export const colors = {
  // Primary palette - soft pastels
  blush: {
    50: '#FFF0F3',
    100: '#FFE4EA',
    200: '#FFB6C1',
    300: '#FF9AAE',
    400: '#FF7E9A',
    500: '#FF6B8A',
  },
  peach: {
    50: '#FFF8F5',
    100: '#FFEDE6',
    200: '#FFD4C4',
    300: '#FFC4B0',
    400: '#FFB49C',
    500: '#FFA088',
  },
  cream: {
    50: '#FFFCFA',
    100: '#FFF8F5',
    200: '#FFF5F0',
    300: '#F5EDE8',
    400: '#EBE3DE',
    500: '#E0D8D3',
  },
  rose: {
    50: '#F5E8E8',
    100: '#EDD5D5',
    200: '#D4A5A5',
    300: '#C99595',
    400: '#BE8585',
    500: '#B37575',
  },
  
  // Mood colors
  moods: {
    magical: '#E8D5F2',
    tender: '#FFD4C4',
    passionate: '#FFB6C1',
    comfortable: '#E8DDD4',
    playful: '#FFE4B5',
    quick: '#F0E68C',
    sleepy: '#D4C5D8',
    reconnecting: '#B8D4E3',
  },
  
  text: {
    primary: '#5A4A4A',
    secondary: '#8B7A7A',
    muted: '#A09090',
    inverse: '#FFFFFF',
  },
  
  background: '#FFF5F0',
  surface: '#FFFFFF',
  card: '#FFFCFA',
  
  heart: '#FF6B7A',
  success: '#A8D5BA',
  warning: '#F4D03F',
  error: '#E8A0A0',
};

export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    md: 18,
    lg: 22,
    xl: 28,
    '2xl': 34,
    '3xl': 42,
  },
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

export const radii = {
  sm: 12,
  md: 20,
  lg: 24,
  xl: 32,
  full: 9999,
};

export const shadows = {
  soft: {
    shadowColor: '#D4A5A5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
};

export const MOODS = [
  { id: 'magical', label: 'Magical', emoji: '✨', color: colors.moods.magical },
  { id: 'tender', label: 'Tender', emoji: '🌸', color: colors.moods.tender },
  { id: 'passionate', label: 'Passionate', emoji: '🔥', color: colors.moods.passionate },
  { id: 'comfortable', label: 'Comfortable', emoji: '🏠', color: colors.moods.comfortable },
  { id: 'playful', label: 'Playful', emoji: '🎭', color: colors.moods.playful },
  { id: 'quick', label: 'Quick', emoji: '⚡', color: colors.moods.quick },
  { id: 'sleepy', label: 'Sleepy', emoji: '🌙', color: colors.moods.sleepy },
  { id: 'reconnecting', label: 'Reconnecting', emoji: '🤝', color: colors.moods.reconnecting },
];
