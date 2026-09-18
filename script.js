// ===============================
// MEMORY CARD GAME
// ===============================

const icons = [
    "🍎",
    "🚀",
    "🎮",
    "⚽",
    "🎧",
    "🔥",
    "💎",
    "🌟"
];

let cards = [...icons, ...icons];

let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let score = 1000;

let timerSeconds = 0;
let timerInterval = null;

let gameStarted = false;
let lockBoard = false;


// ===============================
// ELEMENTS
// ===============================

const gameBoard = document.getElementById("gameBoard");
const timerElement = document.getElementById("timer");
const movesElement = document.getElementById("moves");
const scoreElement = document.getElementById("score");
const matchesElement = document.getElementById("matches");

const winModal = document.getElementById("winModal");

const finalTime = document.getElementById("finalTime");
const finalMoves = document.getElementById("finalMoves");
const finalScore = document.getElementById("finalScore");


// ===============================
// SHUFFLE
// ===============================

function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const randomIndex = Math.floor(
            Math.random() * (i + 1)
        );

        [array[i], array[randomIndex]] =
            [array[randomIndex], array[i]];
    }

    return array;
}


// ===============================
// CREATE BOARD
// ===============================

function createBoard() {

    gameBoard.innerHTML = "";

    const shuffledCards = shuffle([...cards]);

    shuffledCards.forEach((icon, index) => {

        const card = document.createElement("div");

        card.classList.add("card");

        card.dataset.icon = icon;
        card.dataset.index = index;

        card.innerHTML = `
            <div class="card-inner">

                <div class="card-front"></div>

                <div class="card-back">
                    ${icon}
                </div>

            </div>
        `;

        card.addEventListener("click", () => {
            flipCard(card);
        });

        gameBoard.appendChild(card);
    });
}


// ===============================
// FLIP CARD
// ===============================

function flipCard(card) {

    if (lockBoard) return;

    if (card.classList.contains("flipped")) return;

    if (card.classList.contains("matched")) return;

    if (flippedCards.length === 2) return;


    // Start timer on first click

    if (!gameStarted) {

        gameStarted = true;

        startTimer();
    }


    card.classList.add("flipped");

    flippedCards.push(card);


    if (flippedCards.length === 2) {

        moves++;

        movesElement.textContent = moves;

        checkMatch();
    }
}


// ===============================
// CHECK MATCH
// ===============================

function checkMatch() {

    const firstCard = flippedCards[0];
    const secondCard = flippedCards[1];


    if (
        firstCard.dataset.icon ===
        secondCard.dataset.icon
    ) {

        matchCards();

    } else {

        unflipCards();
    }
}


// ===============================
// MATCH
// ===============================

function matchCards() {

    flippedCards.forEach(card => {

        card.classList.add("matched");

    });

    matchedPairs++;

    matchesElement.textContent =
        `${matchedPairs} / ${icons.length}`;

    // Bonus score

    score += 100;

    scoreElement.textContent = score;

    flippedCards = [];


    if (matchedPairs === icons.length) {

        setTimeout(() => {
            finishGame();
        }, 700);
    }
}


// ===============================
// WRONG PAIR
// ===============================

function unflipCards() {

    lockBoard = true;

    // Penalize score

    score = Math.max(0, score - 20);

    scoreElement.textContent = score;


    setTimeout(() => {

        flippedCards.forEach(card => {

            card.classList.remove("flipped");

        });

        flippedCards = [];

        lockBoard = false;

    }, 850);
}


// ===============================
// TIMER
// ===============================

function startTimer() {

    timerInterval = setInterval(() => {

        timerSeconds++;

        updateTimer();

        // Time penalty

        if (timerSeconds % 10 === 0) {

            score = Math.max(0, score - 5);

            scoreElement.textContent = score;
        }

    }, 1000);
}


function updateTimer() {

    const minutes =
        Math.floor(timerSeconds / 60)
            .toString()
            .padStart(2, "0");

    const seconds =
        (timerSeconds % 60)
            .toString()
            .padStart(2, "0");

    timerElement.textContent =
        `${minutes}:${seconds}`;
}


// ===============================
// GAME FINISHED
// ===============================

function finishGame() {

    clearInterval(timerInterval);

    finalTime.textContent = timerElement.textContent;

    finalMoves.textContent = moves;

    finalScore.textContent = score;

    winModal.classList.add("show");
}


// ===============================
// RESTART
// ===============================

function restartGame() {

    clearInterval(timerInterval);

    flippedCards = [];

    matchedPairs = 0;

    moves = 0;

    score = 1000;

    timerSeconds = 0;

    gameStarted = false;

    lockBoard = false;


    timerElement.textContent = "00:00";

    movesElement.textContent = "0";

    scoreElement.textContent = "1000";

    matchesElement.textContent =
        `0 / ${icons.length}`;


    winModal.classList.remove("show");


    createBoard();
}


// ===============================
// START GAME
// ===============================

createBoard();