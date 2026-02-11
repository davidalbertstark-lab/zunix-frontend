// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Zunix Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDAwtx3WMuyElaX0lfd11gaH-g22gs1tes",
  authDomain: "zunix-mast.firebaseapp.com",
  projectId: "zunix-mast",
  storageBucket: "zunix-mast.appspot.com", // fixed bucket
  messagingSenderId: "141730503553",
  appId: "1:141730503553:web:42ab9e2dbf83aeb930a680",
  measurementId: "G-06L8WEZC2J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Optional: auth listener for future use
function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

// Export core Firebase utilities
export { app, auth, db, onAuthChange };
