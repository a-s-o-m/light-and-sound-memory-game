// Global Constants
const nextClueWaitTime = 800; //how long to wait before starting playback of the clue sequence
const patternLength = 10; // Sets the number of turns until player wins

//Global Variables
var pattern = [];
var progress = 0;
var guessCounter = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;  //must be between 0.0 and 1.0
var clueHoldTime; //how long to hold each clue's light/sound
var cluePauseTime; //how long to pause in between clues

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}

function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function play(){
  //initialize game variables
  if(!gamePlaying){
    playInitSequence();
    changeCaptions(-1); // Displays playing captions
    
    gamePlaying = true;
    progress = 0;

    clueHoldTime = 350; // Resets hold and pause time at game start
    cluePauseTime = 340
    
    generatePattern(); // Adds a random sequence of numbers to pattern
    setTimeout(playClueSequence,600);
  }
  else{
    playInitSequence();
    changeCaptions(-1); // Displays main captions
    gamePlaying = false;
  }
}

function loseGame(){ // Displays lose captions, plays lose note sequence
  loseGameSequence();
  gamePlaying = false;
  changeCaptions(0);
}

function winGame(){ // Displays win captions, plays lose note sequence
  winGameSequence();
  gamePlaying = false;
  changeCaptions(1);
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime,1);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  guessCounter = 0;
  clueHoldTime = clueHoldTime > 50 ? clueHoldTime - (progress * 5) : clueHoldTime;
  cluePauseTime = cluePauseTime > 50 ? cluePauseTime - (progress * 6) : cluePauseTime;
  context.resume();
  
  if(progress == Math.floor(patternLength / 2)){ displayResultBtn(0); }
    
  let delay = nextClueWaitTime; //set delay to initial wait time
  
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    setTimeout(playSingleClue,delay,pattern[i]); // set a timeout to play that clue
    delay += clueHoldTime; 
    delay += cluePauseTime;
  }
}

function playInitSequence(){ // Plays note sequence when game is started/ended
  let sequence = [];
  
  if(gamePlaying){ // Ending sequence
    sequence = [5,3,4,2];
    }
  else{ // Starting sequence
    sequence = [2,4,3,5];
  }
  
  let delay = 100;
  for(let i = 0;i < 4;i++){ // for each clue that is revealed so far
    setTimeout(playTone,delay,sequence[i],70,2); // set a timeout to play that clue
    delay += 150; 
  }
}

function winGameSequence(){ // Plays a note sequence when player wins
    setTimeout(playTone, 300, 2, 200, 3);
    setTimeout(playTone, 600, 2, 50, 3);
    setTimeout(playTone, 750, 2, 50, 3);
    setTimeout(playTone, 900, 2, 50, 3);
    setTimeout(playTone, 1050, 3, 150, 3);
    setTimeout(playTone, 1300, 2, 150, 3);
    setTimeout(playTone, 1550, 3, 150, 3);
    setTimeout(playTone, 1800, 4, 400, 3);
}

function loseGameSequence(){ // Plays a note sequence when player wins
    setTimeout(playTone, 300, 3, 200, 0);
    setTimeout(playTone, 600, 2, 200, 0);
    setTimeout(playTone, 900, 2, 200, 0);
    setTimeout(playTone, 1200, 1, 400, 0);
}

function guess(btn){ 
  if(!gamePlaying){
    return;
  }
  if(btn == pattern[guessCounter]){
    if(guessCounter < progress){ // Turn is not over
      guessCounter ++;
    }
    else if(progress == pattern.length - 1){ // Last turn
      displayResultBtn(1);
      winGame();
    }
    else{ // Turn is over
        progress ++;
        playClueSequence();
    }
  }
  else { // Incorrect guess
    displayResultBtn(-1);
    loseGame();
  }
}

function generatePattern(){ // Generates a random pattern of numbers from 1 - len(buttons)
  pattern = [];
  
  for(let i = 0; i < patternLength; i ++){
    // Random number from 0 - length of freqMap
    var randInt = Math.floor(Math.random() * Object.keys(freqMap).length + 1);
    pattern.push(randInt);
  }
}

// Design & Style Functions
var btnMedia = document.getElementById("btnMedia"); // Main gif displayed

function onHover(){ // Changes main gif on mouse hover
  btnMedia.setAttribute("src", "https://cdn.glitch.global/eff5be9a-cdcf-4185-83f3-ef57337b4877/robotHover.gif?v=1648762717396");
}

function unHover(){ // Changes main gif back to original on mouse unhover
  if(gamePlaying && progress >= Math.floor(patternLength / 2)){
    btnMedia.setAttribute("src", "https://cdn.glitch.global/eff5be9a-cdcf-4185-83f3-ef57337b4877/robotProgress.gif?v=1648763986003");
  }
  else if (gamePlaying){
    btnMedia.setAttribute("src", "https://cdn.glitch.global/eff5be9a-cdcf-4185-83f3-ef57337b4877/robotPlaying.gif?v=1648764115856");
  }
  else{
    btnMedia.setAttribute("src", "https://cdn.glitch.global/eff5be9a-cdcf-4185-83f3-ef57337b4877/robotInit.gif?v=1648762705375");
  }
}

function displayResultBtn(result){ // Changes main button depending on the game's result. -1 == Lose, 0 == Progress > pattern.length, 1 == Win
  if (result == 1){
    btnMedia.setAttribute("src", "https://cdn.glitch.global/eff5be9a-cdcf-4185-83f3-ef57337b4877/robotLose.gif?v=1648762730880");
  }
  else if (result == 0){
    btnMedia.setAttribute("src", "https://cdn.glitch.global/eff5be9a-cdcf-4185-83f3-ef57337b4877/robotProgress.gif?v=1648763986003");
  }
  else{
    btnMedia.setAttribute("src", "https://cdn.glitch.global/eff5be9a-cdcf-4185-83f3-ef57337b4877/robotWin.gif?v=1648762727812");
  }
}

function changeCaptions(result){ // Changes captinos displayed in page
  if(result == 1){ // Player wins
    document.getElementById("captionOne").innerText="you won!"
    document.getElementById("captionTwo").innerText="try again?"
  }
  else if(result == 0){ // Player loses
    document.getElementById("captionOne").innerText="robot wins"
    document.getElementById("captionTwo").innerText="try again?"
  }
  else if(gamePlaying){ // Game is ended
    document.getElementById("captionOne").innerText="beat the robot"
    document.getElementById("captionTwo").innerText="click the robot to start/stop"
  }
  else{ // Game is started
    document.getElementById("captionOne").innerText="game on!"
    document.getElementById("captionTwo").innerText="follow the pattern"
  }
}
// Sound Synthesis Functions
const freqMap = {
  1: 261.63, // C4
  2: 311.13, // Eb4
  3: 349.23, // F4
  4: 392.0, // G4
  5: 466.2 // Bb
}
const octaves = { // Rate to increase or decrease a frequency octaves apart
  0: 1.059463 ** (-8), //-1 Octave
  1: 1,
  2: 1.059463 ** (16),// +2 Octaves
  3: 1.059463 ** (8) // + 1 Octave
  
}
function playTone(btn,len,octave){  
  o.frequency.value = freqMap[btn] * octaves[octave] // Frequency at a given octave
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)