// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCnRZwIdH2XPNhZ1c4sgzFGpte6uy0D1fc",
  authDomain: "inventory-manager-e4b32.firebaseapp.com",
  projectId: "inventory-manager-e4b32",
  storageBucket: "inventory-manager-e4b32.appspot.com",
  messagingSenderId: "155552244912",
  appId: "1:155552244912:web:c84611abf0a82664c04775",
  measurementId: "G-YW82E58WM4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);

export {firestore};