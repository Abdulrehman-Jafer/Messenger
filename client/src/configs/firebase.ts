import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCXtzqgnkuKvx-g52XzgbxTSNuOoZf_bSk",
  authDomain: "messenger-ce1a8.firebaseapp.com",
  projectId: "messenger-ce1a8",
  storageBucket: "messenger-ce1a8.appspot.com",
  messagingSenderId: "996822451552",
  appId: "1:996822451552:web:ed321e2d9cd9bf12d80a05",
  measurementId: "G-93KDFZ3HG4",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
