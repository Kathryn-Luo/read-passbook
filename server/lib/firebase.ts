import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";

//your firebase configuration goes here
//https://firebase.google.com/docs/web/learn-more?authuser=0&hl=en#modular-version

const config = useRuntimeConfig()

const firebaseConfig = {
  apiKey: config.public.FIREBASE_API_KEY,
  authDomain: config.public.FIREBASE_AUTH_DOMAIN,
  projectId: config.public.FIREBASE_PROJECT_ID,
  storageBucket: config.public.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: config.public.FIREBASE_MESSAGING_SENDER_ID,
  appId: config.public.FIREBASE_APP_ID,
  measurementId: config.public.FIREBASE_MEASUREMENT_ID
};

export const firebaseApp = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(firebaseApp)

export const firestoreDb = getFirestore(firebaseApp);
