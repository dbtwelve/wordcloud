import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_API_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_API_PROJECT_ID,
    storageBucket: process.env.REACT_APP_API_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_API_MESSAGING_ID,
    appId: process.env.REACT_APP_API_APP_ID,
    measurementId: process.env.REACT_APP_API_MEASUREMENT_ID,
  };

  //export default firebase.initializeApp(firebaseConfig);
  //firebase.analytics();
  firebase.initializeApp(firebaseConfig);
  export const firebaseInstance = firebase;
  export const authService = firebase.auth();
  export const dbService = firebase.firestore();
  export const storageService = firebase.storage();