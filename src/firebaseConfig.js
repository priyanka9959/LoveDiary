import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDTnM_90pyQDhZy-lGtLO0A8TOa864R9nE",
  authDomain: "lovediary-4194a.firebaseapp.com",
  projectId: "lovediary-4194a",
  storageBucket: "lovediary-4194a.firebasestorage.app",
  messagingSenderId: "869730057538",
  appId: "1:869730057538:web:7ebdcc34db23edb93f9cdb"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;