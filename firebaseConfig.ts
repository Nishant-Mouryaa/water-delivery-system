import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyD5KD0tajxl_qGfxyN-foAPupPq1e3NY0M",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "ecommerceapp-7339e.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "ecommerceapp-7339e",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "ecommerceapp-7339e.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "576338094089",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:576338094089:web:341f71595641d6f84730d8",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-Z1T512DJJ8"
};

// Only initialize if no app exists
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);