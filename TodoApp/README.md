# TodoApp

A React Native (Expo) to-do list application with persistent local storage.

## Overview

TodoApp is a classic Expo app (non-router entry) that lets users manage daily tasks. It supports adding, toggling, and deleting todos, filtering by status, and tracking remaining work. All data is persisted locally with AsyncStorage so tasks survive app restarts.

## Features

- Add new tasks via an input field or the keyboard's "done" action.
- Toggle a task's completed state.
- Delete individual tasks.
- Filter tasks by **All**, **Active**, or **Done**.
- Display the number of remaining (incomplete) tasks.
- Clear all completed tasks at once.
- Empty-state messages for no tasks and no matching filter.
- Persistent storage using AsyncStorage through a reusable `usePersistentState` hook.

## Tech Stack

- Expo `~58.0.23`
- React `19.3.0`
- React Native `0.88.1`
- `@react-native-async-storage/async-storage` `2.2.0`
- TypeScript `~6.0.3`

## Project Structure

```
TodoApp/
├── App.tsx                # Main application component
├── index.ts               # Entry point (registerRootComponent)
├── usePersistentState.ts  # Reusable AsyncStorage-backed state hook
├── assets/                # App icons and splash images
├── app.json               # Expo configuration
├── package.json
└── tsconfig.json
```

## Getting Started

1. Install dependencies:

   ```bash
   cd TodoApp
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