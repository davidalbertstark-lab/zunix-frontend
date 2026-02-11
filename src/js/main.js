// js/main.js — root entry for the student-setup flow

/* ---------- UI Controls ---------- */
import { initUI, populateSummary } from './ui.js';

/* ---------- Firebase Services ---------- */
import { auth, onAuthChange } from './firebase.js';

/* ---------- Form Handler ---------- */
import { initFormHandler } from './form-handler.js';

/* ---------- Setup Form Dynamics ---------- */
import { initSetupForm } from './setup-student.js';

/* ---------- App Boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  // Build the multi-step UI
  initUI();

  // Wire dynamic dropdowns (state → city etc.)
  initSetupForm();

  // Listen for Firebase auth state
  onAuthChange(user => {
    if (user) {
      // Inject both full name *and* email into the confirmation summary
      populateSummary(user.email, user.displayName || '');

      // Attach Firestore submit handler with that user’s UID
      initFormHandler(user);
    } else {
      // Not signed in — bounce to login
      window.location.href = '/login.html';
    }
  });
});

/* -------------------------------------------------- *
 *  Fallback direct listener (optional, not required) *
 * -------------------------------------------------- *
 *  If you ever need raw access to auth in another     *
 *  script, you can still use this pattern:            *
 *
 *    auth.onAuthStateChanged(user => { ... });        *
 * -------------------------------------------------- */
