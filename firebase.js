import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "<your-config>",
    authDomain: "<your-config>",
    projectId: "<your-config>",
    storageBucket: "<your-config>",
    messagingSenderId: "<your-config>",
    appId: "<your-config>",
    measurementId: "<your-config>"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
  auth,
  db,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  collection,
  addDoc,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  updateDoc
};
