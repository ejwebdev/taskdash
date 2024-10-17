import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCHe6S8dYipDez7baiWF8FcdvFTPojysnY",
    authDomain: "task-manager-app-9e0da.firebaseapp.com",
    projectId: "task-manager-app-9e0da",
    storageBucket: "task-manager-app-9e0da.appspot.com",
    messagingSenderId: "493126872515",
    appId: "1:493126872515:web:228b312f9f208cdceca176",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
