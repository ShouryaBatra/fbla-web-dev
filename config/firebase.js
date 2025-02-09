// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJ2FcGysJqIMuDQm6B6weFWWpbnfdTfXc",
  authDomain: "fbla-web-dev.firebaseapp.com",
  projectId: "fbla-web-dev",
  storageBucket: "fbla-web-dev.firebasestorage.app",
  messagingSenderId: "340345869369",
  appId: "1:340345869369:web:b19739049dcc6d49d1e9e8",
  measurementId: "G-K074DPRQZM",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
