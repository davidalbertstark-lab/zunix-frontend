// js/setup-student.js
import { errorMessages, validateDateOfBirth, validateGradYear, validateLevel } from './validation.js';

/* -------------------------------------------------- *
 *  Init entry — call this once from main.js          *
 * -------------------------------------------------- */
export function initSetupForm() {
  attachStateCityListener();
  attachInstitutionAutocomplete();
  attachDobFeedback();
}

/* ---------------- State → City chaining ------------ */
function attachStateCityListener() {
  const stateEl = document.getElementById("state");
  const cityEl  = document.getElementById("city");
  if (!stateEl || !cityEl) return;

  const stateToCity = {
    Abia: "Umuahia", Adamawa: "Yola", AkwaIbom: "Uyo", Anambra: "Awka",
    Bauchi: "Bauchi", Bayelsa: "Yenagoa", Benue: "Makurdi", Borno: "Maiduguri",
    CrossRiver: "Calabar", Delta: "Asaba", Ebonyi: "Abakaliki", Edo: "Benin City",
    Ekiti: "Ado Ekiti", Enugu: "Enugu", Gombe: "Gombe", Imo: "Owerri",
    Jigawa: "Dutse", Kaduna: "Kaduna", Kano: "Kano", Katsina: "Katsina",
    Kebbi: "Birnin Kebbi", Kogi: "Lokoja", Kwara: "Ilorin", Lagos: "Ikeja",
    Nasarawa: "Lafia", Niger: "Minna", Ogun: "Abeokuta", Ondo: "Akure",
    Osun: "Oshogbo", Oyo: "Ibadan", Plateau: "Jos", Rivers: "Port Harcourt",
    Sokoto: "Sokoto", Taraba: "Jalingo", Yobe: "Damaturu", Zamfara: "Gusau",
    FCT: "Abuja"
  };

  stateEl.addEventListener("change", () => {
    cityEl.innerHTML = '<option value="">Select a city</option>';
    const capital = stateToCity[stateEl.value];
    if (capital) {
      const opt = document.createElement("option");
      opt.value = capital;
      opt.textContent = capital;
      cityEl.appendChild(opt);
    }
  });
}

/* ------------- Institution autocomplete ------------ */
function attachInstitutionAutocomplete() {
  const inputEl = document.getElementById("institution");
  const listEl  = document.getElementById("institutionList");
  if (!inputEl || !listEl) return;

  fetch("./json/institution.json")
    .then(res => res.json())
    .then(data => {
      const schools = Object.values(data.institutions).flat();

      inputEl.addEventListener("input", () => {
        const q = inputEl.value.toLowerCase();
        listEl.innerHTML = "";

        schools
          .filter(name => name.toLowerCase().includes(q))
          .slice(0, 15)
          .forEach(name => {
            const opt = document.createElement("option");
            opt.value = name;
            listEl.appendChild(opt);
          });
      });
    })
    .catch(err => console.error("Institution fetch error:", err));
}

/* --------------- DOB age feedback ------------------ */
function attachDobFeedback() {
  const dobEl = document.getElementById("dob");
  const msgEl = document.getElementById("dobMessage");
  if (!dobEl || !msgEl) return;

  dobEl.addEventListener("change", () => {
    const dob = new Date(dobEl.value);
    if (isNaN(dob)) {
      msgEl.textContent = "Invalid date.";
      return;
    }
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;

    msgEl.textContent =
      age < 13
        ? `You cannot be ${age} years old.`
        : `You are ${age} year${age === 1 ? "" : "s"} old.`;
  });
}
