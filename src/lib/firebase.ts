
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyAPAj0HjnHJFg11lTyCllqaakd8ha5xRj8",
  authDomain: "nexterdayevents-2d99e.firebaseapp.com",
  projectId: "nexterdayevents-2d99e",
  storageBucket: "nexterdayevents-2d99e.firebasestorage.app",
  messagingSenderId: "114832360976",
  appId: "1:114832360976:web:6b767dfb5740cdd1baac95"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);