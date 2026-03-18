# Sync - Intimacy Tracker for Couples 💕

A beautifully handcrafted React Native app for couples to track their intimate moments with privacy and care.

## Features

### Moment Logging
- 8 mood types with soft, romantic colors
- Energy level slider with heart-shaped indicators
- Initiator tracking (You, Partner, Mutual)
- Context tags with playful emojis
- Private notes with textured backgrounds
- Haptic heartbeat feedback on save

### Visual Timeline
- Flow view: Polaroid-style overlapping cards
- Calendar view: Month grid with mood-colored dots
- Interactive day selection

### Insights & Stats
- Streak counter
- Monthly trend comparison
- Personalized rhythm analysis
- Pattern recognition
- Mood distribution

### Privacy First
- Biometric authentication (Face ID/Touch ID)
- All data stored locally on device
- Optional discreet mode
- Auto-lock after background
- Per-moment privacy toggles

### Couple Sync
- Unique couple code generation
- Combined timeline view
- Mutual insights
- Clean breakup flow

## Tech Stack

- React Native with Expo
- React Navigation (Stack + Bottom Tabs)
- Reanimated 2 for smooth animations
- Zustand for state management
- date-fns for date handling
- expo-local-authentication for biometrics
- expo-notifications for reminders

## Design System

### Colors
- **Blush Pink**: #FFB6C1 - Primary accent
- **Peach**: #FFD4C4 - Secondary accent
- **Warm Cream**: #FFF5F0 - Background
- **Dusty Rose**: #D4A5A5 - Text accents

### Typography
- **Quicksand** - Headings
- **Inter** - Body text
- **Caveat** - Accent/script text

### Shapes
- Large rounded corners (24-32px radius)
- Soft shadows, no harsh lines
- Organic blob shapes for backgrounds

## Getting Started

### Prerequisites
- Node.js (v16+)
- Expo CLI: `npm install -g expo-cli`
- iOS: Xcode (Mac only)
- Android: Android Studio

### Installation

1. Install dependencies:
```bash
cd sync-app
npm install
```

2. Add fonts:
Download and add these fonts to `assets/fonts/`:
- Quicksand (Regular, Light, Medium, SemiBold, Bold)
- Inter (Regular, Medium, Bold)
- Caveat (Regular, Bold)

3. Start the development server:
```bash
npx expo start
```

4. Run on device:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on physical device

### Building for Production

```bash
# iOS
expo build:ios

# Android
expo build:android
```

## Folder Structure

```
sync-app/
├── App.js                 # Main app entry with navigation
├── app.json              # Expo configuration
├── babel.config.js       # Babel configuration
├── package.json          # Dependencies
├── assets/               # Static assets
│   ├── fonts/           # Custom fonts
│   ├── textures/        # Paper textures
│   └── icons/           # App icons
└── src/
    ├── components/      # Reusable UI components
    │   ├── ui.js        # Core UI primitives
    │   ├── animations.js # Animated components
    │   ├── MoodSelector.js
    │   ├── EnergySlider.js
    │   ├── InitiatorPicker.js
    │   ├── TagSelector.js
    │   ├── TimelineCard.js
    │   └── StatsCards.js
    ├── screens/         # Screen components
    │   ├── AuthScreen.js
    │   ├── HomeScreen.js
    │   ├── LogMomentScreen.js
    │   ├── TimelineScreen.js
    │   ├── InsightsScreen.js
    │   ├── RemindersScreen.js
    │   ├── CoupleSyncScreen.js
    │   └── SettingsScreen.js
    ├── context/         # State management
    │   └── store.js     # Zustand store
    ├── utils/           # Utilities
    │   └── helpers.js
    └── theme.js         # Design tokens
```

## License

MIT
