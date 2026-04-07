// add javascript here
//Game state
let answer=0;
let guessCount=0;
let totalWins=0;
let totalGuesses=0;
let scores=0;
//player name
let playerName=prompt("Enter your name:");

//Play
//get level
document.getElementById("playBtn").addEventListener("click", function(){
  let radios  = document.getElementsByName("level");
  let range =3;
  for(let i=0; i < radios.length; i++) {
    if(radios[i].checked){
        range=parseint(radios[i].value);
    }
  }
//round setup
answer= Math.floor(Math.random() * range) + 1;

//disable and enable buttons and radio choices 
document.getElementById("msg").textContent= playerName + ", guess a number between 1 and " + range;
document.getElementById("guess").value="";
document.getElementById("guessBtn").disable= false;
document.getElementById("giveUpBtn").disable= false;
document.getElementById("playBtn").disable= true;

let levelRadios = document.getElementsByName("level");
for(let i=0; i < radios.length; i++) {
      levelRadios[i].diasbled= true;
    }
  
});
