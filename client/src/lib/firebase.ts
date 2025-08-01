import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFirebaseConfig, validateFirebaseConfig } from "@/config/firebase.config";

// Initialize Firebase
const firebaseConfig = getFirebaseConfig();
console.log('Firebase config loaded:', { 
  hasApiKey: !!firebaseConfig.apiKey,
  hasProjectId: !!firebaseConfig.projectId,
  hasAppId: !!firebaseConfig.appId,
  hasStorageBucket: !!firebaseConfig.storageBucket,
  projectId: firebaseConfig.projectId
});

// Validate configuration
if (!validateFirebaseConfig()) {
  console.error('Firebase configuration validation failed');
}

// Initialize Firebase app
export const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;