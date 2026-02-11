// js/validation.js

export const errorMessages = {
  username:    "Please enter a username.",
  gender:      "Please select your gender.",
  dob:         "Please select your date of birth.",
  state:       "Please select a state.",
  city:        "Please select a city.",
  institution: "Please enter your institution name.",
  course:      "Please enter your course of study.",
  faculty:     "Please enter your faculty.",
  level:       "Please select your level.",
  gradYear:    "Please select your graduation year."
};

/* ------------ DOB must be between 13–26 years ------------ */
export function validateDateOfBirth(dob) {
  const birthDate = new Date(dob);
  const today     = new Date();

  const ageYears  = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff   = today.getDate() - birthDate.getDate();

  const realAge = (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0))
    ? ageYears - 1
    : ageYears;

  if (isNaN(realAge)) {
    return { valid: false, message: "Enter a valid date of birth." };
  }
  if (realAge < 13) {
    return { valid: false, message: "You must be at least 13 years old to join Zunix." };
  }
  if (realAge > 26) {
    return { valid: false, message: "Zunix is currently for students aged 13–26 only." };
  }
  return { valid: true };
}

/* ------------ Graduation year: current → current + 4 ------------ */
export function validateGradYear(year) {
  const y = parseInt(year, 10);
  const current = new Date().getFullYear();
  return !isNaN(y) && y >= current && y <= current + 4;
}

/* ------------ Level: must be between 100 and 500 ------------ */
export function validateLevel(level) {
  const num = parseInt(level, 10);
  return !isNaN(num) && num >= 100 && num <= 500;
}
