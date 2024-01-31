import { getDatabase,  } from 'firebase/database';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC650fWwn1hZpOT-v3r-QaCAcpkvOK164Q",
  authDomain: "board-game-1cc84.firebaseapp.com",
  projectId: "board-game-1cc84",
  storageBucket: "board-game-1cc84.appspot.com",
  messagingSenderId: "984909416347",
  appId: "1:984909416347:web:7a7977b79022faaf0d433e",
  measurementId: "G-2YCNWZGQJQ"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);