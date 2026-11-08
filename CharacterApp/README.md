# CharacterApp

A React Native (Expo) app for browsing characters from the Rick and Morty API, built with Expo Router.

## Overview

CharacterApp lets users explore characters from the Rick and Morty universe. It supports debounced search by name, paginated loading with retry, pull-to-refresh, and a detail view per character. Users can mark characters as favorites, persisted locally, and view them in a dedicated Favorites tab.

## Features

- Browse characters in a paginated list (infinite scroll / load more).
- Debounced search by character name.
- Pull-to-refresh to reload the list.
- Loading, error, and empty states with retry.
- Character detail screen: image, name, status, species, type, gender, origin, last known location, and episode count.
- Favorites: toggle via heart icon on the detail screen; persisted with AsyncStorage.
- Character cards display a heart indicator when the character is favorited.
- Favorites tab listing saved characters with retry on failure.
- Tab navigation (Characters / Favorites) using Expo Router.

## Tech Stack

- Expo `~58.0.23`
- React `19.3.0`
- React Native `0.88.1`
- Expo Router `~58.0.30`
- `@expo/vector-icons` `^15.0.2`
- `@react-native-async-storage/async-storage` `2.2.0`
- TypeScript `~6.0.3`

## Project Structure

```
CharacterApp/
├── app/
│   ├── _layout.tsx            # Root stack layout (wraps FavoritesProvider)
│   ├── (tabs)/
│   │   ├── _layout.tsx       # Tab navigator (Characters / Favorites)
│   │   ├── index.tsx         # Character list screen
│   │   └── favorites.tsx     # Favorites screen
│   └── character/[id].tsx    # Character detail screen
├── components/
│   └── CharacterCard.tsx     # Character list item
├── api.ts                    # API types, constants, status colors
├── FavoritesContext.tsx      # Favorites context + AsyncStorage persistence
├── usePersistentState.ts     # Reusable AsyncStorage-backed state hook
├── assets/                   # App icons and splash images
├── app.json                  # Expo configuration
├── package.json
└── tsconfig.json
```

## Getting Started

1. Install dependencies:

   ```bash
   cd CharacterApp
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

## API

Data is fetched from the public Rick and Morty API (`https://rickandmortyapi.com/api/character`). No API key is required.
```