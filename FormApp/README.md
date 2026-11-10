# FormApp

A React Native (Expo) form application demonstrating advanced form handling, validation, and user input patterns.

## Overview

FormApp is a comprehensive registration form built with Expo and TypeScript. It showcases best practices for form state management, field-level and form-level validation, keyboard handling, and reusable form components. Users can enter their details, pick a profile photo, agree to terms, and submit the form with full validation feedback.

## Features

- **Form fields**: Full name, email, password, and confirm password inputs.
- **Avatar picker**: Select a profile photo from the device library using `expo-image-picker`, with permission handling and a remove option.
- **Field validation**: Validates each field on blur and on change, with error messages displayed inline.
  - Name must be at least 2 characters.
  - Email must contain `@`.
  - Password must be at least 4 characters.
  - Confirm password must match the password.
- **Terms agreement**: A switch to accept terms and conditions, with validation.
- **Password visibility toggle**: Show/hide password text.
- **Keyboard handling**: Uses `KeyboardAvoidingView` and `ScrollView` with `keyboardShouldPersistTaps` for a smooth typing experience.
- **Field navigation**: "Next"/"Done" keys on the keyboard move focus between fields; on validation failure, focus moves to the first invalid field.
- **Submit flow**: Validates all fields, shows loading spinner during async registration, displays success/error alerts, and resets the form on success.
- **Visited tracking**: Errors are only shown after a field has been touched or the form has been submitted.
- **Reusable `FormField` component**: A `forwardRef`-based input wrapper with focus/error styling and support for trailing action elements.
- **Empty `components/FormField.tsx`**: Placeholder for an extracted reusable component.

## Tech Stack

- Expo `~58.0.23`
- React `19.3.0`
- React Native `0.88.1`
- `expo-image-picker` `~58.0.10`
- `expo-status-bar` `~58.0.4`
- TypeScript `~6.0.3`

## Project Structure

```
FormApp/
├── App.tsx                  # Main form screen and validation logic
├── components/
│   ├── AvatarPicker.tsx     # Profile photo picker component
│   └── FormField.tsx        # Reusable form field wrapper (placeholder)
├── assets/                  # App icons and splash images
├── app.json                 # Expo configuration
├── package.json
└── tsconfig.json
```

## Getting Started

1. Install dependencies:

   ```bash
   cd FormApp
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

## Notes

- The `fakeRegister` function simulates an async registration that always fails with a "Server error" after 4 seconds. Replace it with a real API call in production.
- Image picker requires media library permissions, which are requested at runtime.
