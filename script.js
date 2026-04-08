// add javascript here
// ─── Player Name ─────────────────────────────────────────────────────────────
var rawName = prompt("What is your name?") || "Player";
var playerName = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();

// ─── Game State ───────────────────────────────────────────────────────────────
var answer = 0;
var guessCount = 0;
var range = 10;
var roundStart = 0;

// ─── Stats ────────────────────────────────────────────────────────────────────
var wins = 0;
var totalGuesses = 0;
var scores = [];
var totalTime = 0;
var fastestTime = null;
var gamesPlayed = 0;

// ─── Date / Time ──────────────────────────────────────────────────────────────
var monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function daySuffix(day) {
  if (day >= 11 && day <= 13) return day + "th";
  var last = day % 10;
  if (last === 1) return day + "st";
  if (last === 2) return day + "nd";
  if (last === 3) return day + "rd";
  return day + "th";
}

function time() {
  var now = new Date();
  var month = monthNames[now.getMonth()];
  var day   = daySuffix(now.getDate());
  var year  = now.getFullYear();

  var h = now.getHours();
  var m = now.getMinutes();
  var s = now.getSeconds();
  var ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  var mm = m < 10 ? "0" + m : m;
  var ss = s < 10 ? "0" + s : s;

  return month + " " + day + ", " + year + "  ·  " + h + ":" + mm + ":" + ss + " " + ampm;
}

// Update the clock immediately and every second
document.getElementById("date").textContent = time();
setInterval(function() {
  document.getElementById("date").textContent = time();
}, 1000);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getRange() {
  var selected = document.querySelector('input[name="level"]:checked');
  return selected ? parseInt(selected.value) : 10;
}

function setLeaderboard() {
  var items = document.querySelectorAll('li[name="leaderboard"]');
  for (var i = 0; i < items.length; i++) {
    items[i].textContent = scores[i] !== undefined ? scores[i] : "--";
  }
}

// ─── updateScore ──────────────────────────────────────────────────────────────
function updateScore(score) {
  if (score !== range) {
    // Only count as a win when the player guessed correctly
    wins++;
    totalGuesses += score;
    document.getElementById("wins").textContent = wins;
    document.getElementById("avgScore").textContent = (totalGuesses / wins).toFixed(1);
  } else {
    // Give up — add the score to the array but don't count as a win
    totalGuesses += score;
    // We still track avgScore across all games for give-ups
  }

  scores.push(score);
  scores.sort(function(a, b) { return a - b; });
  setLeaderboard();
}

// ─── updateTimers ─────────────────────────────────────────────────────────────
function updateTimers(endMs) {
  var elapsed = (endMs - roundStart) / 1000;
  gamesPlayed++;
  totalTime += elapsed;

  if (fastestTime === null || elapsed < fastestTime) {
    fastestTime = elapsed;
  }

  document.getElementById("fastest").textContent = fastestTime.toFixed(2) + "s";
  document.getElementById("avgTime").textContent = (totalTime / gamesPlayed).toFixed(2) + "s";
}

// ─── reset ────────────────────────────────────────────────────────────────────
function reset() {
  document.getElementById("playBtn").disabled = false;
  document.getElementById("guessBtn").disabled = true;
  document.getElementById("giveUpBtn").disabled = true;
  document.getElementById("guess").disabled = true;

  // Re-enable difficulty radios
  var radios = document.querySelectorAll('input[name="level"]');
  for (var i = 0; i < radios.length; i++) {
    radios[i].disabled = false;
  }
}

// ─── play ─────────────────────────────────────────────────────────────────────
function play() {
  range = getRange();
  answer = Math.floor(Math.random() * range) + 1;
  guessCount = 0;
  roundStart = new Date().getTime();

  document.getElementById("playBtn").disabled = true;
  document.getElementById("guessBtn").disabled = false;
  document.getElementById("giveUpBtn").disabled = false;
  document.getElementById("guess").disabled = false;
  document.getElementById("guess").value = "";

  // Disable radios during round
  var radios = document.querySelectorAll('input[name="level"]');
  for (var i = 0; i < radios.length; i++) {
    radios[i].disabled = true;
  }

  document.getElementById("msg").textContent =
    playerName + ", guess a number between 1 and " + range + "!";
}

// ─── makeGuess ────────────────────────────────────────────────────────────────
function makeGuess() {
  var guessInput = document.getElementById("guess");
  var guess = parseInt(guessInput.value);

  if (isNaN(guess) || guess < 1 || guess > range) {
    document.getElementById("msg").textContent =
      playerName + ", please enter a valid number between 1 and " + range + ".";
    return;
  }

  guessCount++;

  if (guess === answer) {
    document.getElementById("msg").textContent =
      "Correct! " + playerName + ", you got it in " + guessCount + " guess" +
      (guessCount === 1 ? "" : "es") + "! 🎉";
    document.getElementById("guessBtn").disabled = true;
    document.getElementById("giveUpBtn").disabled = true;

    updateScore(guessCount);
    updateTimers(new Date().getTime());
    reset();
    return;
  }

  var diff = Math.abs(guess - answer);
  var proximity = "";
  if (diff <= 2) {
    proximity = " You're hot! 🔥";
  } else if (diff <= 5) {
    proximity = " Getting warm! 🌡️";
  } else {
    proximity = " You're cold! 🧊";
  }

  var direction = guess > answer ? "Too high!" : "Too low!";
  document.getElementById("msg").textContent =
    playerName + ", " + direction + proximity;

  guessInput.value = "";
}

// ─── giveUp ───────────────────────────────────────────────────────────────────
function giveUp() {
  document.getElementById("msg").textContent =
    "You gave up, " + playerName + ". The answer was " + answer + ". 😔";

  updateScore(range);
  updateTimers(new Date().getTime());
  reset();
}

// ─── Event Listeners ──────────────────────────────────────────────────────────
document.getElementById("playBtn").addEventListener("click", play);
document.getElementById("guessBtn").addEventListener("click", makeGuess);
document.getElementById("giveUpBtn").addEventListener("click", giveUp);

// Bonus: Enter key submits a guess
document.getElementById("guess").addEventListener("keydown", function(e) {
  if (e.key === "Enter" && !document.getElementById("guessBtn").disabled) {
    makeGuess();
  }
});
