import {auth} from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";

export const signup = async (email: string, password: string): Promise<void> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // console.log("User signed up:", userCredential.user);
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error("Error signing up:", error.message);
    } else {
      console.error("Unknown error during signup:", error);
    }
  }
};

export const signin = async (email: string, password: string): Promise<void> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // console.log("User signed in:", userCredential.user);
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error("Error signing in:", error.message);
    } else {
      console.error("Unknown error during signin:", error);
    }
  }
};