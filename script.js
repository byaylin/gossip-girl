var timerTag = document.querySelector(`#timerTag`);
var timerPTag  = document.querySelector(`header`).children[1]; 
var submitHighscoreBtn = document.querySelector(`#submitHighscoreBtn`); 
var viewHighscoresBtn = document.querySelector(`#viewHighscoresBtn`); 
var clearHighscoreBtn = document.querySelector(`#clearHighscoreBtn`);
var answerButtonLst = document.body.querySelector(`ul`);
var goBackHighscoreBtn = document.querySelector(`#goBackBtn`); 
var startBtn = document.querySelector(`#startBtn`);
var titleTag = document.querySelector(`#title`) 

//question and answer 
var questionObj = {
    questions: [ 
        `Who does Dan save from being hit by a cab?`,
        `Who does Nate kiss on accident, thinking she was Serena?`,
        `What's the name of the school Nate's dad want him to attend?`,
        `What is the name of Jenny and Dan's mom?`,
        `Which city does Gossip Girl take place in?`,
    ],
    answers: [ //answers are in second listed in array 
        [`Jenny`, `Serena`, `Dorota`, `Blair`],
        [`Blair`, `Jenny`,`Kati`,`Penelope`],
        [`Brown`, `Darthmouth`,`Columbia`, `Yale`], 
        [`Bella`,`Allison`,`Caroline`,`Catherine`],
        [`Seattle`,`New York`,`Los Angeles`,`Miami`] 
    ] 
}

var timerPreset = 75; 
var questionIndexNumber = 0; 
var timeLeft = timerPreset; 
var score = 0; 
var gameEnded = true; 

//sets up game
function setUpGame() {
    timeLeft = timerPreset;
    timerTag.textContent = timerPreset;
    document.querySelector(`#display-highscore-div`).style.display = `none`; 
    titleTag.textContent = `Gossip Girl Quiz`;
    titleTag.style.display = `block`; 
    document.querySelector(`#instructions`).style.display = `block`; 
    viewHighscoresBtn.style.display = `block`; 
    startBtn.style.display = `block`;
    return;
}

//starts quiz 
function startGame() {
    gameEnded = false;
    questionIndexNumber = 0; 

    viewHighscoresBtn.style.display = `none`
    startBtn.style.display = `none`; 
    document.querySelector(`#instructions`).style.display = `none`; 
    timerPTag.style.display = `block`;

    showQuestions(questionIndexNumber); 
    startTimer(); 

    return;
}

//timer interval that runs while user takes quiz
function startTimer() {
    var timerInterval = setInterval(function() {
        if(gameEnded === true) {
            clearInterval(timerInterval); 
            return;
        }
        if(timeLeft < 1) {
            clearInterval(timerInterval);
            endGame();
        }
        timerTag.textContent = timeLeft; 
        timeLeft--; 
    }, 1000);
    return;
}

//uses the questionIndexNumber to show the question of the current index and its answers
function showQuestions(currentQuestionIndex) {
    titleTag.textContent = questionObj.questions[currentQuestionIndex]; 
    createAnswerElements(currentQuestionIndex);

    return;
}

//creates new answer elements in the answer list will clear out previous answers
function createAnswerElements(currentQuestionIndex) {
    answerButtonLst.innerHTML = '';

    for (let answerIndex = 0; answerIndex < questionObj.answers[currentQuestionIndex].length; answerIndex++) {
        var currentAnswerListItem = document.createElement(`li`); 
        var tempStr = questionObj.answers[currentQuestionIndex][answerIndex];
        if (questionObj.answers[currentQuestionIndex][answerIndex].includes(`correct:`)){
            tempStr = questionObj.answers[currentQuestionIndex][answerIndex].substring(8, questionObj.answers[currentQuestionIndex][answerIndex].length);
            currentAnswerListItem.id = `correct`;
        }
        currentAnswerListItem.textContent = tempStr;
        answerButtonLst.appendChild(currentAnswerListItem);
    }
    return;
}
//displays next question
function nextQuestion() {
    questionIndexNumber++;
    if (questionIndexNumber >= questionObj.questions.length){ 
        endGame(); 
    } else {
        showQuestions(questionIndexNumber);
    }
    return;
}

//ends game 
function endGame() {
    gameEnded = true; 
    score = timeLeft; 

    //hide necessary elements
    timerPTag.style.display = `none`;
    titleTag.style.display = `none`;
    answerButtonLst.innerHTML = '';
    document.querySelector(`#scoreSpan`).textContent = score;
    document.querySelector(`#submit-highscore-div`).style.display = `block`;
    return;
}
//checks players answer 
function checkAnswer(event) {
    if (event.target != answerButtonLst){ 
        if (!(event.target.id.includes('correct'))){
            timeLeft -= 10; 
        }
        nextQuestion(); 
    }
    return;
}

//stores players initials and score
function storeScoreAndName() {
    var highscoreTextbox = document.querySelector(`input`); 
    var tempArrayOfObjects = [];

    if (highscoreTextbox.value != `` || highscoreTextbox.value != null) {
        var tempObject = {
            names: highscoreTextbox.value,
            scores: score, 
        }
        if(window.localStorage.getItem(`highscores`) == null) {
            tempArrayOfObjects.push(tempObject); 
            window.localStorage.setItem(`highscores`, JSON.stringify(tempArrayOfObjects)); 
        } else { 
            tempArrayOfObjects = JSON.parse(window.localStorage.getItem(`highscores`)); 
            for (let index = 0; index <= tempArrayOfObjects.length; index++) { 
                if (index == tempArrayOfObjects.length) {
                    tempArrayOfObjects.push(tempObject) 
                    break;
                } else if (tempArrayOfObjects[index].scores < score) { 
                    tempArrayOfObjects.splice(index, 0, tempObject);
                    break;
                }
            }
            window.localStorage.setItem(`highscores`, JSON.stringify(tempArrayOfObjects))
        }
        document.querySelector(`input`).value = ``;
        score = 0;

        showHighscores();
    }
    return;
}

//all highscores shown 
function showHighscores() {
    //elements needed to hide
    titleTag.style.display = `none`;
    startBtn.style.display = `none`; 
    document.querySelector(`header`).children[0].style.display = `none`; 
    document.querySelector(`#instructions`).style.display = `none`; 
    document.querySelector(`#submit-highscore-div`).style.display = `none`; 
    document.querySelector(`#display-highscore-div`).style.display = `block`; 

    tempOrderedList = document.querySelector(`ol`);
    tempOrderedList.innerHTML = `` 

    tempArrayOfObjects = JSON.parse(window.localStorage.getItem(`highscores`));
    if (tempArrayOfObjects != null) {
        for (let index = 0; index < tempArrayOfObjects.length; index++) {
            var newLi = document.createElement(`li`) 
            newLi.textContent = tempArrayOfObjects[index].names + ` - ` + tempArrayOfObjects[index].scores;
            tempOrderedList.appendChild(newLi);
        }
    } else {
        var newLi = document.createElement(`p`) 
        newLi.textContent = `No Highscores`
        tempOrderedList.appendChild(newLi);
    }
    return;
}

//clears highscores saved on local storage
function clearHighscores() {
    document.querySelector(`ol`).innerHTML = ``;
    window.localStorage.clear();
    setUpGame(); 
    return;
}

function init() {
    startBtn.addEventListener(`click`, startGame); 
    answerButtonLst.addEventListener(`click`, checkAnswer); 
    viewHighscoresBtn.addEventListener(`click`, showHighscores);
    submitHighscoreBtn.addEventListener(`click`, storeScoreAndName);
    clearHighscoreBtn.addEventListener(`click`, clearHighscores); 
    goBackHighscoreBtn.addEventListener(`click`, setUpGame);
    setUpGame();
    return;
}

init();