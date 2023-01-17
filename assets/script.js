// list of all questions, choices, and answers
var questions = [
    {
      title: 'Commonly used data types DO NOT include:',
      choices: ['strings', 'booleans', 'alerts', 'numbers'],
      answer: 'alerts',
    },
    {
      title: 'The condition in an if / else statement is enclosed within ____.',
      choices: ['quotes', 'curly brackets', 'parentheses', 'square brackets'],
      answer: 'parentheses',
    },
    {
      title: 'Arrays in JavaScript can be used to store ____.',
      choices: [
        'numbers and strings',
        'other arrays',
        'booleans',
        'all of the above',
      ],
      answer: 'all of the above',
    },
    {
      title:
        'String values must be enclosed within ____ when being assigned to variables.',
      choices: ['commas', 'curly brackets', 'quotes', 'parentheses'],
      answer: 'quotes',
    },
    {
      title:
        'A very useful tool used during development and debugging for printing content to the debugger is:',
      choices: ['JavaScript', 'terminal / bash', 'for loops', 'console.log'],
      answer: 'console.log',
    },
  ];


// TIMER CLOCK CODE
var timeEl = document.querySelector(".timer-container");
var secondsLeft = 75;
var finish = false;

function Countdown() {
    var timerInterval = setInterval(function() {
        secondsLeft--;
        timeEl.textContent = secondsLeft;
        if (secondsLeft >= 0 && finish) {
            clearInterval(timerInterval);
            QuizFinished();
        } else if (secondsLeft <= 0) {
            clearInterval(timerInterval);
            QuizFail();
        }
    }, 1000);
};

//start quiz
var QuizBegin = document.querySelector(".start-quiz-btn");
var MainContent = document.querySelector(".main-start-page");
var QContent = document.querySelector(".questions-page");
var QTitle = document.querySelector(".Question");
var QChoices = document.querySelector(".Answer-choices");
var QFinished = document.querySelector(".quiz-finished-page");
var QFailed = document.querySelector(".quiz-failed-page");
var QScore = document.querySelector("#finished-score");
var BacktoMain = document.querySelector(".back-to-main-btn");
var BacktoMain2 = document.querySelector(".back-to-main-btn-2");
var Leaderboard = document.querySelector(".leaderboard-container");
var ClearScores = document.querySelector(".Clear-Score-btn");
var emojiSignal = document.querySelector(".Emote");


QuizBegin.addEventListener("click", function() {
    MainContent.setAttribute("hidden", true);
    QContent.style.display = "block";
    NextQ(0);
    Countdown();
});

//to display next set of questions
function NextQ (index) {
    // removes previous list of choices
    while (QChoices.firstChild) {
        QChoices.removeChild(QChoices.firstChild);
    }
    //set the quiz to finish when all 4 questions have been answered
    if (index == 5) {
        finish = true;
    } else {
    //for multiple answer choices and the interactions
        QTitle.textContent = questions[index].title;
        for (var i = 0; i < 4; i++) {
            var li = document.createElement("li");
            li.textContent = questions[index].choices[i];
            li.setAttribute("type", "button");
            li.setAttribute("style", "margin:20px; padding:5px; border-radius: 5px; text-align:center; background-color:pink; color:white;");
            li.addEventListener("mouseover", (event) => {
                event.target.style.backgroundColor="black";
            });
            li.addEventListener("mouseleave", (event) => {
                event.target.style.backgroundColor="pink";
            });

            if (questions[index].choices[i] == questions[index].answer) {
                li.addEventListener("click", function(event) {
                event.stopPropagation();
                emojiSignal.textContent += "✔";
                NextQ(index+1);
            });  
            } else {
                li.addEventListener("click", function(event) {
                event.stopPropagation();
                secondsLeft -= 15;
                emojiSignal.textContent += "✖";
                NextQ(index+1);
            });
        }
        QChoices.appendChild(li);
        }
    }

};

// Quiz ends function: two results based on time left
function QuizFinished() {
    QContent.style.display = "none";
    QFinished.style.display = "block";
    QScore.textContent = secondsLeft;
};

// saving scores and leaderboard actions
var UserScores = document.querySelector(".submit-score-btn");
var LeaderboardList = document.querySelector(".scores-list");
var InitialsInput = document.querySelector("#Initials-Input");
var scorelist = [];

function saveScore() {
    var UserScore = {
        Initials: InitialsInput.value.trim(),
        Score: secondsLeft
    };
    scorelist.push(UserScore);
    //sort scores highest to lowest
    if (scorelist.length > 1) {
        scorelist.sort(function(a,b) {
            return b.Score - a.Score;
        });
    };
    // to keep leaderboard to limit of 10 scores; removes lowest score
    if (scorelist.length > 10) {
        scorelist.pop();
    };
    localStorage.setItem("UserScore", JSON.stringify(scorelist));
};
function renderScore() {
    var LeaderboardScore = JSON.parse(localStorage.getItem("UserScore"));
    while (LeaderboardList.firstChild) {
        LeaderboardList.removeChild(LeaderboardList.firstChild);
    };

    for (var i = 0; i < scorelist.length; i++) {
        var li = document.createElement("li");
        li.textContent = LeaderboardScore[i].Initials + ": " + LeaderboardScore[i].Score + " points";
        LeaderboardList.appendChild(li);
    }
};
// to display existing scores
function init() {
    var storedScores = JSON.parse(localStorage.getItem("UserScore"));
    if (storedScores !== null) {
        scorelist = storedScores;
    }
    renderScore();
}
init();

UserScores.addEventListener("click", function(event) {
    event.preventDefault();
    event.stopPropagation();
    UserScores.disabled = true; //prevent user from submitting multiple entries
    saveScore();
    renderScore();
});

//removes local storage scores
ClearScores.addEventListener("click", function(event) {
    event.stopPropagation;
    localStorage.removeItem("UserScore");
    scorelist = [];
    renderScore();
});

//if timer results to less than or = 0
function QuizFail () {
    QContent.style.display = "none";
    QFailed.style.display = "block";
};

// back to main page action buttons
BacktoMain.addEventListener("click", function() {
    RTM();
});

function RTM() {
    MainContent.removeAttribute("hidden");
    QFailed.style.display = "none";
    QFinished.style.display = "none";
    secondsLeft = 75;
    timeEl.textContent = secondsLeft;
    finish = false;
    UserScores.disabled = false;
    emojiSignal.textContent = "";
};

BacktoMain2.addEventListener("click", function() {
    RTM();
});
