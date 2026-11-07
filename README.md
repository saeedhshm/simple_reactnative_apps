# Simple React Native Apps

A collection of small React Native (Expo) applications, each in its own folder.

## CalculatorApp

An Expo Router calculator app with a dark-themed keypad. Supports digit entry, decimal input, the four basic operators (`+`, `-`, `×`, `÷`), chained calculations, clear, and an error state for invalid operations (e.g. division by zero). Results are formatted to avoid floating-point artifacts.

## TodoApp

A classic Expo todo list app. Features adding, toggling, and deleting tasks, filtering by all/active/done, a remaining-count display, and clearing completed items. Todos are persisted across app restarts using AsyncStorage via a reusable `usePersistentState` hook.

## CharacterApp

An Expo Router app that browses characters from the Rick and Morty API. Includes debounced name search, paginated "load more" with retry, pull-to-refresh, loading/error/empty states, and a detail screen showing species, type, gender, origin, last known location, and episode count. Favorites can be toggled on the detail screen (heart icon) and are persisted with AsyncStorage; a dedicated Favorites tab lists saved characters.

## fitness-app

A starter Expo Router app styled with NativeWind/Tailwind CSS. Includes a tab navigator (home and explore screens), themed components, haptic tabs, and a parallax scroll view, serving as a base for fitness-related features.

## todo-app

An Expo Router todo app backed by a Convex real-time backend. Supports creating, toggling, editing, and deleting todos, a dark/light theme toggle, progress display, and loading states. Data is synced through Convex queries and mutations.

---

> This README is organized by app. When a new app is added, add a new section describing it; when an existing app gains or changes features, update its section accordingly.
