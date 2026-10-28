// Firebase Configuration and Initialization
// Smart Parking Management - com.smartparking.management

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuration keys can be injected via environment variables or set directly here.
// When using placeholders (e.g. YOUR_FIREBASE_API_KEY), the application safely activates
// DEMO MODE with persistent local storage.
export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSy_DEMO_KEY_PLACEHOLDER_NOT_CONFIGURED",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "smart-parking-management.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "smart-parking-management",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "smart-parking-management.appspot.com",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:123456789012:android:abcdef1234567890",
};

// Check if credentials are genuine (not placeholder)
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  !firebaseConfig.apiKey.includes('PLACEHOLDER') &&
  firebaseConfig.projectId &&
  !firebaseConfig.projectId.includes('PLACEHOLDER')
);

let app = null;
let auth = null;
let firestore = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    firestore = getFirestore(app);
    console.log('[Firebase] Connected to live Cloud Firestore & Auth:', firebaseConfig.projectId);
  } catch (error) {
    console.warn('[Firebase] Initialization error, falling back to local demo mode:', error.message);
    app = null;
    auth = null;
    firestore = null;
  }
} else {
  console.log('[Firebase] Using DEMO MODE (Local Persistent Storage). To connect real Firebase, add credentials in src/firebase/config.js or .env');
}

export { app, auth, firestore };
