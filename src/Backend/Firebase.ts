// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.REACT_APP_API_KEY,
  authDomain: import.meta.env.REACT_APP_AUTH_DOMAIN,
  projectId: import.meta.env.REACT_APP_PROJECT_ID,
  storageBucket: import.meta.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.REACT_APP_SENDER_ID,
  appId: import.meta.env.REACT_APP_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export {db, auth};