const startSection = document.querySelector('.start-section');
const gameSection = document.querySelector('.game-section');
const startButton = document.querySelector('.game--start');
const restartButton = document.querySelector('.game--restart');
const statusDisplay = document.querySelector('.game--status');

let gameActive = true;
let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];
let winningLineElement;

const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Show the game section and hide the start section
function handleStartGame() {
    startSection.classList.add('hidden');
    gameSection.classList.remove('hidden');
    statusDisplay.innerHTML = currentPlayerTurn();
}

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
    clickedCell.style.pointerEvents = "none";
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
}

function handleResultValidation() {
    let roundWon = false;
    let winningCondition;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            winningCondition = [a, b, c];
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        drawWinningLine(winningCondition);
        gameActive = false;
        return;
    }

    if (!gameState.includes("")) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }

    handlePlayerChange();
}

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

function handleRestartGame() {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = currentPlayerTurn();

    document.querySelectorAll('.cell').forEach(cell => {
        cell.innerHTML = "";
        cell.style.pointerEvents = "auto";
    });

    if (winningLineElement) {
        winningLineElement.remove();
        winningLineElement = null;
    }
}

function drawWinningLine(condition) {
    const gameContainer = document.querySelector('.game--container');
    const [a, b, c] = condition;
    const cells = document.querySelectorAll('.cell');
    const rectA = cells[a].getBoundingClientRect();
    const rectC = cells[c].getBoundingClientRect();
    const containerRect = gameContainer.getBoundingClientRect();

    // Calculate the starting and ending points relative to the container
    const x1 = rectA.left + rectA.width / 2 - containerRect.left;
    const y1 = rectA.top + rectA.height / 2 - containerRect.top;
    const x2 = rectC.left + rectC.width / 2 - containerRect.left;
    const y2 = rectC.top + rectC.height / 2 - containerRect.top;

    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

    // Create and style the winning line element
    winningLineElement = document.createElement('div');
    winningLineElement.classList.add('winning-line');
    winningLineElement.style.width = `${length}px`;
    winningLineElement.style.transform = `rotate(${angle}deg)`;
    winningLineElement.style.left = `${x1}px`;
    winningLineElement.style.top = `${y1}px`;

    gameContainer.appendChild(winningLineElement);
}


// Event Listeners
startButton.addEventListener('click', handleStartGame);
document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', handleRestartGame);
