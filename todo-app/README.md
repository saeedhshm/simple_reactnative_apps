# todo-app

A React Native (Expo) to-do application backed by a Convex real-time backend, with theming and task management features.

## Overview

todo-app is an Expo Router project that manages todos through a Convex backend. It supports creating, toggling, editing, and deleting tasks, with a dark/light theme toggle, progress tracking, and a settings screen. The UI uses linear gradients and themed styles for a polished look.

## Features

- Create new todos.
- Toggle a todo's completed state.
- Edit an existing todo's text inline.
- Delete todos with a confirmation dialog.
- Real-time data sync via Convex queries and mutations.
- Dark/light theme toggle with themed gradients and colors.
- Progress state display (completed vs. total).
- Settings screen with preferences.
- Empty-state component when no todos exist.
- Loading spinner while data is fetching.

## Tech Stack

- Expo `~58.0.23`
- React `19.3.0`
- React Native `0.88.1`
- Expo Router `~58.0.30`
- Convex (real-time backend: schema, queries, mutations)
- `expo-linear-gradient`
- `react-native-safe-area-context`
- `@expo/vector-icons`
- TypeScript `~6.0.3`

## Project Structure

```
todo-app/
├── src/app/
│   ├── _layout.tsx              # Root layout
│   └── (tabs)/
│       ├── _layout.tsx          # Tab navigator
│       ├── index.tsx            # Todo list screen
│       └── settings.tsx         # Settings screen
├── components/                  # Reusable UI components
├── hooks/useTheme.tsx           # Theme context hook
├── assets/styles/               # Style factories (home, settings)
├── convex/                      # Convex backend
│   ├── schema.ts                # Database schema (todos table)
│   └── todos_crud.ts            # CRUD mutations/queries
├── assets/                      # App icons and splash images
├── app.json                     # Expo configuration
├── package.json
└── tsconfig.json
```

## Getting Started

1. Install dependencies:

   ```bash
   cd todo-app
   npm install
   ```

2. Configure Convex (first run):

   ```bash
   npx convex dev
   ```

3. Start the development server:

   ```bash
   npx expo start
   ```

4. Run on a platform:

   ```bash
   npm run android   # Android emulator/device
   npm run ios       # iOS simulator/device
   npm run web       # Web browser
   ```

## Backend

Todos are stored in a Convex `todos` table with fields `text` (string) and `isCompleted` (boolean). CRUD operations are defined in `convex/todos_crud.ts`.
```