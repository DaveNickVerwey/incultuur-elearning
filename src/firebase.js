import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAFmMgVL1lKhSyG_P2TJI70BtEDx2xEMI4",
  authDomain: "incultuur-elearning.firebaseapp.com",
  projectId: "incultuur-elearning",
  storageBucket: "incultuur-elearning.firebasestorage.app",
  messagingSenderId: "372966324542",
  appId: "1:372966324542:web:5c29ecbc8e5bf66cb1946f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);