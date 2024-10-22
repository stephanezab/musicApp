// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import Constants from 'expo-constants'
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: Constants.expoConfig.extra.firebase_apikey,
  authDomain: Constants.expoConfig.extra.firebase_authDomain,
  projectId: Constants.expoConfig.extra.firebase_projectid,
  storageBucket: Constants.expoConfig.extra.firebase_storageBucket,
  messagingSenderId: Constants.expoConfig.extra.firebase_messaging_senderid,
  appId: Constants.expoConfig.extra.firebase_appid,
  measurementId: Constants.expoConfig.extra.firebase_measurementid
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const db = getFirestore(app);