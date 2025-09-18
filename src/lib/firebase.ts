// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxIyiPars5oEQhXa7I17lRMPYykyCfgm0",
  authDomain: "elevate-75464.firebaseapp.com",
  databaseURL: "https://elevate-75464-default-rtdb.firebaseio.com",
  projectId: "elevate-75464",
  storageBucket: "elevate-75464.firebasestorage.app",
  messagingSenderId: "390894032026",
  appId: "1:390894032026:web:e47272a760495ab99e7b23",
  measurementId: "G-M94ZYRGRJQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);

// Initialize Analytics (only in browser environment)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app;