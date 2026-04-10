// Ask for player name and capitalize it
var rawName = prompt("What is your name?") || "Player";
var playerName = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();

// Game variables
var answer = 0;
var guessCount = 0;
var range = 10;
var roundStart = 0;

// Stats variables
var wins = 0;
var totalGuesses = 0;
var scores = [];
var totalTime = 0;
var fastestTime = null;
var gamesPlayed = 0;

// Extra: streak tracking
var currentStreak = 0;
var bestStreak = 0;

// Month names array for the date display
var monthNames = ["January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"];

// Returns the correct suffix for a day number (1st, 2nd, 3rd, 4th, etc.)
function daySuffix(day) {
  if (day >= 11 && day <= 13) {
    return day + "th";
  }
  var last = day % 10;
  if (last === 1) return day + "st";
  if (last === 2) return day + "nd";
  if (last === 3) return day + "rd";
  return day + "th";
}

// Returns a formatted date and time string
function time() {
  var now = new Date();
  var month = monthNames[now.getMonth()];
  var day = daySuffix(now.getDate());
  var year = now.getFullYear();

  var h = now.getHours();
  var m = now.getMinutes();
  var s = now.getSeconds();
  var ampm = "AM";
  if (h >= 12) {
    ampm = "PM";
  }
  h = h % 12;
  if (h === 0) {
    h = 12;
  }
  var mm = m < 10 ? "0" + m : m;
  var ss = s < 10 ? "0" + s : s;

  return month + " " + day + ", " + year + " - " + h + ":" + mm + ":" + ss + " " + ampm;
}

// Show date right away and update every second
document.getElementById("date").textContent = time();
setInterval(function() {
  document.getElementById("date").textContent = time();
}, 1000);

// Gets the currently selected difficulty range
function getRange() {
  var selected = document.querySelector('input[name="level"]:checked');
  return parseInt(selected.value);
}

// Updates the leaderboard display with top 3 scores
function setLeaderboard() {
  var items = document.querySelectorAll('li[name="leaderboard"]');
  for (var i = 0; i < items.length; i++) {
    if (scores[i] !== undefined) {
      items[i].textContent = scores[i];
    } else {
      items[i].textContent = "--";
    }
  }
}

// Extra: gives feedback based on how good the score was
function scoreFeedback(guesses) {
  var ratio = guesses / range;
  if (ratio <= 0.2) {
    return " Amazing! 🌟";
  } else if (ratio <= 0.5) {
    return " Great job! 👍";
  } else {
    return " Keep practicing! 💪";
  }
}

// Extra: updates the streak display
function updateStreak(won) {
  if (won) {
    currentStreak = currentStreak + 1;
    if (currentStreak > bestStreak) {
      bestStreak = currentStreak;
    }
  } else {
    currentStreak = 0;
  }
  document.getElementById("streakDisplay").textContent =
    "🔥 Current Streak: " + currentStreak + " | Best Streak: " + bestStreak;
}

// Updates wins, average score, and leaderboard after a round
function updateScore(score) {
  wins = wins + 1;
  totalGuesses = totalGuesses + score;
  document.getElementById("wins").textContent = "Total wins: " + wins;
  document.getElementById("avgScore").textContent = "Average Score: " + (totalGuesses / wins).toFixed(1);

  scores.push(score);
  scores.sort(function(a, b) { return a - b; });
  setLeaderboard();
}

// Calculates and displays round time, fastest game, and average time
function updateTimers(endMs) {
  var elapsed = (endMs - roundStart) / 1000;
  gamesPlayed = gamesPlayed + 1;
  totalTime = totalTime + elapsed;

  if (fastestTime === null || elapsed < fastestTime) {
    fastestTime = elapsed;
  }

  document.getElementById("fastest").textContent = "Fastest Game: " + fastestTime.toFixed(2) + "s";
  document.getElementById("avgTime").textContent = "Average Time: " + (totalTime / gamesPlayed).toFixed(2) + "s";
}

// Resets buttons for the next round
function reset() {
  document.getElementById("playBtn").disabled = false;
  document.getElementById("guessBtn").disabled = true;
  document.getElementById("giveUpBtn").disabled = true;
  document.getElementById("guess").disabled = true;
  document.getElementById("guess").value = "";

  var radios = document.querySelectorAll('input[name="level"]');
  for (var i = 0; i < radios.length; i++) {
    radios[i].disabled = false;
  }
}

// Starts a new round
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

  var radios = document.querySelectorAll('input[name="level"]');
  for (var i = 0; i < radios.length; i++) {
    radios[i].disabled = true;
  }

  document.getElementById("msg").textContent =
    playerName + ", guess a number between 1 and " + range + "!";
}

// Handles a guess
function makeGuess() {
  var guessInput = document.getElementById("guess");
  var guess = parseInt(guessInput.value);

  // Extra: input validation
  if (isNaN(guess) || guess < 1 || guess > range) {
    document.getElementById("msg").textContent =
      playerName + ", please enter a valid number between 1 and " + range + ".";
    return;
  }

  guessCount = guessCount + 1;

  if (guess === answer) {
    var feedback = scoreFeedback(guessCount);
    document.getElementById("msg").textContent =
      "Correct! " + playerName + ", you got it in " + guessCount +
      (guessCount === 1 ? " guess!" : " guesses!") + feedback;

    document.getElementById("guessBtn").disabled = true;
    document.getElementById("giveUpBtn").disabled = true;

    updateScore(guessCount);
    updateTimers(new Date().getTime());
    updateStreak(true);
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

  if (guess > answer) {
    document.getElementById("msg").textContent = playerName + ", too high!" + proximity;
  } else {
    document.getElementById("msg").textContent = playerName + ", too low!" + proximity;
  }

  guessInput.value = "";
}

// Ends the round early and sets score to range value
function giveUp() {
  var endTime = new Date().getTime();

  document.getElementById("msg").textContent =
    "You gave up, " + playerName + ". The answer was " + answer + ". 😔";

  wins = wins + 1;
  totalGuesses = totalGuesses + range;
  document.getElementById("wins").textContent = "Total wins: " + wins;
  document.getElementById("avgScore").textContent = "Average Score: " + (totalGuesses / wins).toFixed(1);

  scores.push(range);
  scores.sort(function(a, b) { return a - b; });
  setLeaderboard();

  updateTimers(endTime);
  updateStreak(false);
  reset();
}

// Wire up the buttons
document.getElementById("playBtn").addEventListener("click", play);
document.getElementById("guessBtn").addEventListener("click", makeGuess);
document.getElementById("giveUpBtn").addEventListener("click", giveUp);

// Extra: press Enter to submit a guess
document.getElementById("guess").addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    if (!document.getElementById("guessBtn").disabled) {
      makeGuess();
    }
  }
});