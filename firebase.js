// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBjq2BKoBNKyXVPTFDH0C0vxJWiQjRyDb0",
  authDomain: "pantry-tracker-d1ef3.firebaseapp.com",
  projectId: "pantry-tracker-d1ef3",
  storageBucket: "pantry-tracker-d1ef3.appspot.com",
  messagingSenderId: "831507216116",
  appId: "1:831507216116:web:8afa0b99680547305d50a1",
  measurementId: "G-FJTNBZC4GG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore=getFirestore(app);
export {firestore};