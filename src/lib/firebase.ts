// Import the functions you need from the SDKs you need
import { initializeApp , getApps , getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvmZRkl63cF5LcIHd9zffGTy_9nnVy5Z4",
  authDomain: "nexterday-test.firebaseapp.com",
  projectId: "nexterday-test",
  storageBucket: "nexterday-test.firebasestorage.app",
  messagingSenderId: "731721436928",
  appId: "1:731721436928:web:d9c47f5c0aca3463d2ede5"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const firestore =  getFirestore(app);