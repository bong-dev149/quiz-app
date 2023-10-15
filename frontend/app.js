"use strict";

// DOM selectors
const playerInfo = document.querySelector(".enter-the-game-block");
const playeArea = document.querySelector(".play-area");
const questionBlock = document.querySelector(".ques-block");
const quesContainer = document.querySelector(".question");
const optContainer = document.querySelector(".ans-options");
const opts = document.getElementsByName("op");
const gameOverBlock = document.querySelector(".game-over-block");
const scoreShowCase = document.querySelector(".score-showcase");
const playerMsg = document.querySelector(".player-msg");
const mainContainer = document.querySelector(".main-container");
const mediaContainer = document.querySelector(".media-container");



const serverAddr = "http://localhost:3000";
// useful variables
let playerName,
  questions,
  qCount,
  score,
  go,
  gs = false,
  timer,
  mediaOut,
  optOut;

// window load event handling and setting the web content
window.addEventListener("load", (e) => {
  mainContainer.innerHTML = playerInfo.innerHTML;
});

// function for getting the questions from the json file
async function getQuestions() {
  try {
    const response = await fetch(serverAddr + "/questions");
    questions = await response.json();
  } catch (error) {
    console.log(error);
  }
}

// Function for showing game over window
function gameOver() {
  let msg = "";
  scoreShowCase.innerHTML = `${score}/10`;
  if (score >= 5 && score <= 7) {
    msg = `${playerName}! You are awesome player`;
  } else if (score > 7 && score <= 10) {
    msg = `${playerName}! You are the mastermind`;
  } else {
    msg = `Try and try ${playerName} never give up`;
  }
  document.querySelector(".player-msg").innerHTML = msg;
  playeArea.innerHTML = gameOverBlock.innerHTML;
  go = true;
}

// Function for next button click functionality
function next() {
  // resetting the timer
  timer = 30;
  // get the current the answer
  for (let i = 0; i < 4; i++) {
    if (opts[i].checked) {
      if (questions[qCount].correctAns === i + 1) {
        score++;
        console.log(score);
      }
    }
  }
  //   now move to the next question
  qCount++;
  showQuestion(qCount);
}

// Function for showing question on the screen
function showQuestion(n) {
  // console.log(n);
  // checking if the question limit is ended
  if (n === questions.length) {
    gameOver();
    return;
  }
  mediaContainer.innerHTML = "";
  console.log("Question : " + (qCount + 1));
  // change the play area content
  console.log(questions[n].options);
  optOut = `
  <form action="" id="option-form">
  <label class="cont">
    <input type="radio" name="op" />
    <label for="op" id="op1" class="opt">${questions[n].options[0]}</label>
  </label>
  <label class="cont">
    <input type="radio" name="op" />
    <label for="op" id="op2" class="opt">${questions[n].options[1]}</label>
  </label>
  <label class="cont">
    <input type="radio" name="op" />
    <label for="op" id="op3" class="opt">${questions[n].options[2]}</label>
  </label>
  <label class="cont">
    <input type="radio" name="op" />
    <label for="op" id="op4" class="opt">${questions[n].options[3]}</label>
  </label>
</form>
  `;
  console.log(optOut);
  if (questions[n].media !== "") {
    if (
      questions[n].media.includes(".jpg") ||
      questions[n].media.includes(".png")
    ) {
      mediaOut = `<img src="${questions[n].media}" alt="img" style="width:90%;">`;
    } else if (questions[n].media.includes(".mp4")) {
      mediaOut = ` <video width="400" height="400" autoplay>
      <source src="${questions[n].media}" type="video/mp4">
    Your browser does not support the video tag.
    </video> `;
    } else {
      mediaOut = `<audio controls autoplay>
      <source src="${questions[n].media}" type="audio/mpeg">
    Your browser does not support the audio element.
    </audio>`;
    }
    mediaContainer.innerHTML = mediaOut;
  } else {
    mediaContainer.innerHTML = "<img";
  }

  quesContainer.innerHTML = questions[n].stmt;
  playeArea.innerHTML = questionBlock.innerHTML;
  document.querySelector(".ans-options").innerHTML = optOut;
}

function getPlayer(e) {
  playerName = e.target[0].value;
  if (playerName === "") {
    document.getElementById("show-name-error").innerHTML =
      "Player name can not be empty";
    gs = false;
  } else {
    document.getElementById("show-name-error").innerHTML = "";
    mainContainer.innerHTML = "";
    document.querySelector(".play-container").style.display = "grid";
    showQuestion(qCount);
  }
}

async function init(e) {
  e.preventDefault();
  playerName = ""; // empty string as we don't know the player name at first
  questions = [];
  qCount = 0;
  score = 0;
  go = false;
  gs = true;
  timer = 30;
  // get questions
  await getQuestions()
    .then((res) => {
      // then get the player
      getPlayer(e);
    })
    .catch((err) => {
      console.log(err);
    });
}

// set interval to call the next function after 1 sec;
setInterval(() => {
  if (gs && !go) {
    if (timer === 0) {
      // go to the next question
      next();
    } else {
      document.querySelector(".timer").innerHTML = timer;
      timer--;
      // console.log(timer);
    }
  }
}, 1000);
