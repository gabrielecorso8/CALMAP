function openSettings() {
  document.getElementById("panel-settings").classList.toggle("hidden");
  document.getElementById("panel-gamification").classList.add("hidden");
}

function openGamification() {
  document.getElementById("panel-gamification").classList.toggle("hidden");
  document.getElementById("panel-settings").classList.add("hidden");
}

function goHome() {
  document.getElementById("panel-settings").classList.add("hidden");
  document.getElementById("panel-gamification").classList.add("hidden");
}

// Gamification logica base
let points = 0;
let level = 1;

function addPoints(amount) {
  points += amount;
  if (points >= 100) {
    level += 1;
    points = points % 100;
  }
  document.getElementById("points").textContent = points;
  document.getElementById("level").textContent = level;
}

// Esempio: aggiungi punti se un obiettivo è stato completato oggi prima dell’orario fissato
// In futuro: integrabile con JSON + timestamp
