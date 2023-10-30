// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_GAUTH_KEY,
  authDomain: "shahid-estate.firebaseapp.com",
  projectId: "shahid-estate",
  storageBucket: "shahid-estate.appspot.com",
  messagingSenderId: "1016452198160",
  appId: "1:1016452198160:web:26c2d28cf9c0c77ef03f95"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);