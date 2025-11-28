# POINT OF SALES

Multiplatform Expo React-Native SDK 54, Typescript, Zustand + React Query + AsyncStorage, react-native-paper style.

## 1. INITIAL FRONTEND

```javascript
npx create-expo-app@latest frontend_public --template
cd frontend_public
```

## 2. START

Installing dependencies and initial files

```javascript

npx expo install react-dom react-native-web

# State & API
npm i @tanstack/react-query axios zustand

# Local Storage
npm i @react-native-async-storage/async-storage

# UI Framework
npm i react-native-paper react-native-vector-icons

# Navigation (stack + tabs)
npm i @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context

npx expo start --web
```

## 3. Login Screen and initial navigation, api, store

Update the tsconfig.json then restart TS server.
Create initial files.

## 4. Add Login, Register, Forgot Password screens

Create the files

## 5. Add Main App Features

Inital Products, Sales, Reports screens

## 6. Products CRUD

npx expo install expo-image-picker
npm i react-hook-form yup @hookform/resolvers

Create the files

## 7. Add full Sales/Checkout cart system
