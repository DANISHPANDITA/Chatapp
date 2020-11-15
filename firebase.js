// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";
const config = {
  apiKey: "AIzaSyCbPFwqhrCgnlGVjtlgUv7JA2BCDF1j2mk",
  authDomain: "chatapp-e4e70.firebaseapp.com",
  databaseURL: "https://chatapp-e4e70.firebaseio.com",
  projectId: "chatapp-e4e70",
  storageBucket: "chatapp-e4e70.appspot.com",
  messagingSenderId: "9998994630",
  appId: "1:9998994630:web:7af95150a4d4e126c35bc7",
  measurementId: "G-NF7KTGH6YE",
};

const firebaseApp = firebase.initializeApp(config);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const googleAuth = new firebase.auth.GoogleAuthProvider();

export { googleAuth, auth };
export default db;
