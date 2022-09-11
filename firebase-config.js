// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDBZ3zWp5x9D-PwV5sa11uzqLm4g45ymoo",
    authDomain: "todo-list-ed40b.firebaseapp.com",
    projectId: "todo-list-ed40b",
    storageBucket: "todo-list-ed40b.appspot.com",
    messagingSenderId: "931993897995",
    appId: "1:931993897995:web:51a4f61d26e7b55fa88b0e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth(app);
