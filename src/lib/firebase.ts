import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDsXL7k930CrIMgFdGODILcubo5mGdjeqk",
    authDomain: "medifind-2ea78.firebaseapp.com",
    projectId: "medifind-2ea78",
    storageBucket: "medifind-2ea78.firebasestorage.app",
    messagingSenderId: "632258732258",
    appId: "1:632258732258:web:862e0b6e111baa2559bebb",
    measurementId: "G-PWK2FH96FP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
