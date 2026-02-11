// src/js/form-handler.js
import { db } from './firebase.js';
import {
  doc,
  setDoc,
  getDoc, // NEW: Needed to check if student profile already exists
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { populateSummary, finishSetup } from './ui.js';

/* -------------------------------------------------- *
 * Attach listener once user is available             *
 * -------------------------------------------------- */
export function initFormHandler(user) {
  const submitBtn = document.getElementById('submitBtn');
  if (!submitBtn) return;

  // Prevent duplicate listeners on hot reloads
  const freshBtn = submitBtn.cloneNode(true);
  submitBtn.parentNode.replaceChild(freshBtn, submitBtn);

  freshBtn.addEventListener('click', e => handleFormSubmit(e, user, freshBtn));
}

/* -------------------------------------------------- *
 * Submit handler                                     *
 * -------------------------------------------------- */
async function handleFormSubmit(event, user, btn) {
  event.preventDefault();

  if (!user?.uid) {
    alert('Please log in again.');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Saving...';

  const data = extractFormData();
  if (!data) {
    btn.disabled = false;
    btn.textContent = 'Finish';
    alert('Please complete all required fields.');
    return;
  }

  try {
    const ref = doc(db, 'students', user.uid);
    const snapshot = await getDoc(ref);

    const payload = {
      ...data,
      uid: user.uid,
      email: user.email,
      ...(snapshot.exists() ? {} : { createdAt: serverTimestamp() }) // ✅ Only on first save
    };

    await setDoc(ref, payload, { merge: true });

    populateSummary(user.email, user.displayName);   // Reflect back to step 6 UI
    finishSetup();                 // Show completion screen
    console.log('Student profile stored successfully.');
  } catch (err) {
    console.error('Firestore write failed:', err);
    alert('Error saving profile. Try again.');
    btn.disabled = false;
    btn.textContent = 'Finish';
  }
}

/* -------------------------------------------------- *
 * Extract & sanitize form values                     *
 * -------------------------------------------------- */
function extractFormData() {
  try {
    const safe = id => (document.getElementById(id)?.value || '').trim();

    return {
      username:     safe('username'),
      gender:       safe('gender'),
      dob:          safe('dob'),
      region:       safe('campusRegion'),
      state:        safe('state'),
      city:         safe('city'),
      institution:  safe('institution'),
      course:       safe('course'),
      faculty:      safe('faculty'),
      level:        safe('level'),
      gradYear:     safe('gradYear')
    };
  } catch (err) {
    console.error('Error extracting form data:', err);
    return null;
  }
}
