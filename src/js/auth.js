// src/js/auth.js
import { auth, db } from './firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ------------ UI Helper (fallback alert if showMessage missing) ------------- */
const show = (msg, id, good = false) =>
  window.showMessage ? window.showMessage(msg, id, !good) : alert(msg);

/* ------------ Save / Merge profile in Firestore -------------- */
async function saveProfile(user, extra = {}) {
  const ref = doc(db, "users", user.uid);
  const snapshot = await getDoc(ref);

  // Only set createdAt if it's a new user document
  const data = {
    uid: user.uid,
    name: user.displayName || "",
    email: user.email,
    role: "student",
    ...extra,
  };

  if (!snapshot.exists()) {
    data.createdAt = serverTimestamp();
  }

  await setDoc(ref, data, { merge: true });
}

/* -------------------- SIGN-UP -------------------- */
window.validateForm = async (e) => {
  e.preventDefault();
  const f = e.target;
  const fullName = f.fullName.value.trim();
  const email = f.email.value.trim();
  const pwd = f.password.value;
  const confirm = f.confirmPassword.value;

  if (!window.isPasswordStrong(pwd))
    return show("Password must be 6+ chars, incl. a number & special char.", "error-msg");

  if (pwd !== confirm)
    return show("Passwords do not match.", "error-msg");

  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, pwd);
    await updateProfile(user, { displayName: fullName });
    await saveProfile(user, { name: fullName });

    show("Account created! Redirecting…", "signUpMessage", true);
    setTimeout(() => (window.location.href = "/setup-student.html"), 1500);
  } catch (err) {
    show(err.message, "error-msg");
  }
  return false;
};

/* -------------------- LOGIN -------------------- */
window.handleLogin = async (e) => {
  e.preventDefault();
  const f = e.target;
  const email = f.email.value.trim();
  const pwd = f.password.value;

  try {
    await signInWithEmailAndPassword(auth, email, pwd);
    show("Welcome back! Redirecting…", "signInMessage", true);
    // 🔄 Redirect straight to the setup flow, not dashboard
    setTimeout(() => (window.location.href = "/setup-student.html"), 1500);
  } catch (err) {
    show(err.message, "signInMessage");
  }
  return false;
};

/* -------------------- GOOGLE AUTH -------------------- */
const provider = new GoogleAuthProvider();

async function googleAuth(targetDiv, redirectPath) {
  try {
    const { user } = await signInWithPopup(auth, provider);
    await saveProfile(user); // Only saves if not yet saved
    window.location.href = redirectPath;
  } catch (err) {
    show(err.message, targetDiv);
  }
}

window.googleSignUp = () => googleAuth("signUpMessage", "/setup-student.html");
// Also push sign-IN users to the same setup flow
window.googleSignIn = () => googleAuth("signInMessage", "/setup-student.html");
