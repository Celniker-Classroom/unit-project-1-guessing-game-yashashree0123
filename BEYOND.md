Above and Beyond
Extra Features I Added
1. Score Quality Feedback
Where: scoreFeedback() function in script.js, called in makeGuess() when the player wins
After each correct guess, the message includes a rating based on how many guesses it took compared to the range. For example, if you guess in 1 out of 100 possible numbers, it says "Amazing! 🌟". This makes winning more satisfying.
2. Win Streak Tracking
Where: currentStreak and bestStreak variables in script.js, updateStreak() function, #streakDisplay element in index.html
Tracks how many rounds in a row the player has won. Displayed below the guess buttons. Giving up resets the streak to 0, which encourages the player to keep guessing instead of giving up.
3. Input Validation
Where: makeGuess() in script.js, the isNaN check at the top of the function
If the player types something that isn't a number, or a number outside the valid range, an error message shows and the guess count does not go up. This prevents accidental wasted guesses.
4. Enter Key to Guess
Where: keydown event listener on #guess at the bottom of script.js
The player can press Enter instead of clicking the Guess button, which makes the game faster to play.
5. CSS Styling
Where: style.css
Added a clean card-based layout with a light blue background, rounded buttons with hover effects, color-coded text for stats, and a disabled button style so the player can clearly see which buttons are active.