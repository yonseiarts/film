// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhiHGN4Te72lL0SfJIIEbre7eBYcfzJ5w",
  authDomain: "yonsei-rental.firebaseapp.com",
  projectId: "yonsei-rental",
  storageBucket: "yonsei-rental.firebasestorage.app",
  messagingSenderId: "701854349149",
  appId: "1:701854349149:web:18fa86ab435b0991769ab4",
  measurementId: "G-M604C04PLS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
