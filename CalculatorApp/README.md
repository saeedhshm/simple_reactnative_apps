# CalculatorApp

A React Native (Expo) calculator application built with Expo Router and TypeScript.

## Overview

CalculatorApp provides a dark-themed calculator interface with a standard keypad layout. It supports basic arithmetic operations, chained calculations, decimal input, and clear, with results formatted to avoid floating-point precision artifacts.

## Features

- Digit entry (`0`–`9`) and decimal point input.
- Basic operators: addition (`+`), subtraction (`−`), multiplication (`×`), division (`÷`).
- Chained operations (e.g. `2 + 3 + 4` evaluates step by step).
- Equals (`=`) to compute the result.
- Clear (`C`) to reset the display and state.
- Sign (`±`) and percent (`%`) keys present on the keypad.
- Division by zero returns an `Error` result.
- Results formatted via `toPrecision(12)` to avoid values like `0.30000000000000004`.

## Tech Stack

- Expo `~58.0.23`
- React `19.3.0`
- React Native `0.88.1`
- Expo Router `~58.0.30`
- TypeScript `~6.0.3`

## Project Structure

```
CalculatorApp/
├── src/
│   └── app/
│       ├── _layout.tsx   # Root stack layout
│       └── index.tsx     # Calculator screen
├── assets/images/        # App icons and splash images
├── app.json              # Expo configuration
├── package.json
└── tsconfig.json
```

## Getting Started

1. Install dependencies:

   ```bash
   cd CalculatorApp
   npm install
   ```

2. Start the development server:

   ```bash
   npx expo start
   ```

3. Run on a platform:

   ```bash
   npm run android   # Android emulator
   npm run ios       # iOS simulator
   npm run web       # Web browser
   ```

## Linting

```bash
npm run lint
```