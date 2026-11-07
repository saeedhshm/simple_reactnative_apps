# fitness-app

A React Native (Expo) starter application styled with NativeWind/Tailwind CSS, using Expo Router.

## Overview

fitness-app is an Expo Router project scaffolded from the default template and configured with NativeWind for Tailwind-style styling. It includes a tab navigator with home and explore screens plus a set of reusable themed components, serving as a base for building fitness-related features.

## Features

- File-based routing with Expo Router.
- Tab navigation (Home and Explore screens).
- NativeWind/Tailwind CSS styling (utility classes in components).
- Themed components (`ThemedText`, `ThemedView`) with light/dark support.
- Parallax scroll view and collapsible sections on the Explore screen.
- Haptic tab bar feedback.
- Cross-platform support (Android, iOS, web).

## Tech Stack

- Expo `~58.0.23`
- React `19.3.0`
- React Native `0.88.1`
- Expo Router `~58.0.30`
- NativeWind (Tailwind CSS for React Native)
- TypeScript `~6.0.3`

## Project Structure

```
fitness-app/
├── app/
│   ├── _layout.tsx          # Root stack layout
│   ├── modal.tsx            # Modal screen
│   └── (tabs)/
│       ├── _layout.tsx      # Tab navigator
│       ├── index.tsx        # Home screen
│       └── explore.tsx      # Explore screen
├── components/              # Reusable UI components
├── constants/theme.ts       # Theme constants
├── hooks/                   # Color scheme / theme hooks
├── assets/images/           # App icons and splash images
├── global.css               # Global Tailwind styles
├── tailwind.config.js       # Tailwind configuration
├── metro.config.js          # Metro bundler config (NativeWind)
├── babel.config.js          # Babel config
├── app.json                 # Expo configuration
├── package.json
└── tsconfig.json
```

## Getting Started

1. Install dependencies:

   ```bash
   cd fitness-app
   npm install
   ```

2. Start the development server:

   ```bash
   npx expo start
   ```

3. Run on a platform:

   ```bash
   npm run android   # Android emulator/device
   npm run ios       # iOS simulator/device
   npm run web       # Web browser
   ```

## Linting

```bash
npm run lint
```