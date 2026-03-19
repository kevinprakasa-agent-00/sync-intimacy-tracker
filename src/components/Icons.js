import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Rect, Polygon, Line } from 'react-native-svg';
import { colors } from '../theme';

// Custom SVG Icon Component
// Consistent icons across all platforms - no emojis

const iconPaths = {
  // Tab icons
  home: (props) => (
    <Svg viewBox="0 0 24 24" width={props.size} height={props.size} fill="none">
      <Path
        d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        stroke={props.color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={props.fill ? props.color : 'none'}
      />
      <Path
        d="M9 22V12h6v10"
        stroke={props.color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),
  
  timeline: (props) => (
    <Svg viewBox="0 0 24 24" width={props.size} height={props.size} fill="none">
      <Rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="2"
        stroke={props.color}
        strokeWidth={2}
      />
      <Path
        d="M8 2v4M16 2v4M3 10h18"
        stroke={props.color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  ),
  
  insights: (props) => (
    <Svg viewBox="0 0 24 24" width={props.size} height={props.size} fill="none">
      <Path
        d="M18 20V10M12 20V4M6 20v-6"
        stroke={props.color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),
  
  // Mood icons
  sparkles: (props) => (
    <Svg viewBox="0 0 24 24" width={props.size} height={props.size} fill="none">
      <Path
        d="M12 3L14.5 9.5L21 12L14.5 14.5L12 21L9.5 14.5L3 12L9.5 9.5L12 3Z"
        fill={props.color}
      />
      <Path
        d="M19 3L19.5 4.5L21 5L19.5 5.5L19 7L18.5 5.5L17 5L18.5 4.5L19 3Z"
        fill={props.color}
        opacity={0.6}
      />
    </Svg>
  ),
  
  heart: (props) => (
    <Svg viewBox="0 0 24 24" width={props.size} height={props.size} fill="none">
      <Path
        d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
        fill={props.color}
      />
    </Svg>
  ),
  
  flame: (props) => (
    <Svg viewBox="0 0 24 24" width={props.size} height={props.size} fill="none">
      <Path
        d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"
        fill={props.color}
      />
    </Svg>
  ),
  
  home: (props) => (
    <Svg viewBox="0 0 24 24" width={props.size} height={props.size} fill="none">
      <Path
        d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        stroke={props.color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 22V12h6v10"
        stroke={props.color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),
  
  joy: (props) => (
    <Svg viewBox="0 0 24 24" width={props.size} height={props.size} fill="none">
      <Circle cx="12" cy="12" r="10" stroke={props.color} strokeWidth={2} fill={props.fill ? props.color : 'none'} />
      <Path
        d="M8 14s1.5 2 4 2 4-2 4-2"
        stroke={props.color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Circle cx="9" cy="9" r="1.5" fill={props.color} />
      <Circle cx="15" cy="9" r="1.5" fill={props.color} />
    </Svg>
  ),
  
  zap: (props) => (
    <Svg viewBox="0 0 24 24" width={props.size} height={props.size} fill="none">
      <Polygon
        points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
        fill={props.color}
      />
    </Svg>
  ),
  
  moon: (props) => (
    <Svg viewBox="0 0 24 24" width={props.size} height={props.size} fill="none">
      <Path
        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
        fill={props.color}
      />
    </Svg>
  ),
  
  link: (props) => (
    <Svg viewBox="0 0 24 24" width={props.size} height={props.size} fill="none">
      <Path
        d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"
        stroke={props.color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"
        stroke={props.color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),
  
  // UI icons
  close: (props) => (
    <Svg viewBox="0 0 24 24" width={props.size} height={props.size} fill="none">
      <Path
        d="M18 6L6 18M6 6l12 12"
        stroke={props.color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),
  
  search: (props) => (
    <Svg viewBox="0 0 24 24" width={props.size} height={props.size} fill="none">
      <Circle cx="11" cy="11" r="8" stroke={props.color} strokeWidth={2} />
      <Path
        d="M21 21l-4.35-4.35"
        stroke={props.color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),
  
  filter: (props) => (
    <Svg viewBox="0 0 24 24" width={props.size} height={props.size} fill="none">
      <Polygon
        points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"
        stroke={props.color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),
  
  list: (props) => (
    <Svg viewBox="0 0 24 24" width={props.size} height={props.size} fill="none">
      <Path
        d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
        stroke={props.color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),
  
  calendar: (props) => (
    <Svg viewBox="0 0 24 24" width={props.size} height={props.size} fill="none">
      <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke={props.color} strokeWidth={2} />
      <Path d="M16 2v4M8 2v4M3 10h18" stroke={props.color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  ),
  
  chevronLeft: (props) => (
    <Svg viewBox="0 0 24 24" width={props.size} height={props.size} fill="none">
      <Path
        d="M15 18l-6-6 6-6"
        stroke={props.color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),
  
  chevronRight: (props) => (
    <Svg viewBox="0 0 24 24" width={props.size} height={props.size} fill="none">
      <Path
        d="M9 18l6-6-6-6"
        stroke={props.color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),
  
  plus: (props) => (
    <Svg viewBox="0 0 24 24" width={props.size} height={props.size} fill="none">
      <Path
        d="M12 5v14M5 12h14"
        stroke={props.color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),
  
  check: (props) => (
    <Svg viewBox="0 0 24 24" width={props.size} height={props.size} fill="none">
      <Path
        d="M20 6L9 17l-5-5"
        stroke={props.color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),
  
  lock: (props) => (
    <Svg viewBox="0 0 24 24" width={props.size} height={props.size} fill="none">
      <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke={props.color} strokeWidth={2} />
      <Path d="M7 11V7a5 5 0 0110 0v4" stroke={props.color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  ),
  
  shield: (props) => (
    <Svg viewBox="0 0 24 24" width={props.size} height={props.size} fill="none">
      <Path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke={props.color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),
  
  settings: (props) => (
    <Svg viewBox="0 0 24 24" width={props.size} height={props.size} fill="none">
      <Circle cx="12" cy="12" r="3" stroke={props.color} strokeWidth={2} />
      <Path
        d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
        stroke={props.color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),
  
  fire: (props) => (
    <Svg viewBox="0 0 24 24" width={props.size} height={props.size} fill="none">
      <Path
        d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"
        fill={props.color}
      />
    </Svg>
  ),
  
  chart: (props) => (
    <Svg viewBox="0 0 24 24" width={props.size} height={props.size} fill="none">
      <Path
        d="M18 20V10M12 20V4M6 20v-6"
        stroke={props.color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),
  
  clock: (props) => (
    <Svg viewBox="0 0 24 24" width={props.size} height={props.size} fill="none">
      <Circle cx="12" cy="12" r="10" stroke={props.color} strokeWidth={2} />
      <Path
        d="M12 6v6l4 2"
        stroke={props.color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),
  
  empty: (props) => (
    <Svg viewBox="0 0 24 24" width={props.size} height={props.size} fill="none">
      <Rect x="4" y="4" width="16" height="16" rx="2" stroke={props.color} strokeWidth={2} strokeDasharray="4 4" />
    </Svg>
  ),
};

export const Icons = ({ name, size = 24, color = colors.text.primary, fill = false, style }) => {
  const IconComponent = iconPaths[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }
  
  return (
    <View style={style}>
      <IconComponent size={size} color={color} fill={fill} />
    </View>
  );
};

// MoodIcon component for consistent mood representation
export const MoodIcon = ({ moodId, size = 24, color }) => {
  const moodIcons = {
    magical: 'sparkles',
    tender: 'heart',
    passionate: 'flame',
    comfortable: 'home',
    playful: 'joy',
    quick: 'zap',
    sleepy: 'moon',
    reconnecting: 'link',
  };
  
  const iconName = moodIcons[moodId] || 'heart';
  return <Icons name={iconName} size={size} color={color} fill={true} />;
};
