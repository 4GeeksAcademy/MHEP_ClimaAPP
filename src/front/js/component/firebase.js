// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyApjxCBvwLVsW8B6WFLsgJ3AxCoMEM8--I",
  authDomain: "app-de-clima-cd5ef.firebaseapp.com",
  projectId: "app-de-clima-cd5ef",
  storageBucket: "app-de-clima-cd5ef.appspot.com",
  messagingSenderId: "157882657628",
  appId: "1:157882657628:web:3a8df06718e466630eef99",
  measurementId: "G-TRHDBC0V03",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };