import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Replace with your Firebase project config (from Firebase Console > Project Settings > General > Your apps > SDK setup and configuration)
const firebaseConfig = {
  apiKey: "AIzaSyD5KD0tajxl_qGfxyN-foAPupPq1e3NY0M",
  authDomain: "ecommerceapp-7339e.firebaseapp.com",
  projectId: "ecommerceapp-7339e",
  storageBucket: "ecommerceapp-7339e.firebasestorage.app",
  messagingSenderId: "576338094089",
  appId: "1:576338094089:web:341f71595641d6f84730d8",
  measurementId: "G-Z1T512DJJ8"
};

// Only initialize if no app exists
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);