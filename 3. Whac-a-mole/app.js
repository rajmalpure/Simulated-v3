// Selecting elements
const grid = document.querySelector('.grid');
const scoreDisplay = document.getElementById('score');
const timeLeftDisplay = document.getElementById('time-left');

// Game variables
let score = 0;
let timeLeft = 30;
let molePosition;
let timerId;

// Create grid squares dynamically
function createGrid() {
  for (let i = 0; i < 9; i++) {
    const square = document.createElement('div');
    square.classList.add('square');
    square.setAttribute('id', i);
    grid.appendChild(square);
  }
}

// Randomly place the mole
function randomMole() {
  document.querySelectorAll('.square').forEach(square => {
    square.classList.remove('mole');
  });
  const randomSquare = grid.children[Math.floor(Math.random() * 9)];
  randomSquare.classList.add('mole');
  molePosition = randomSquare.id;
}

// Handle click event
function whackMole(event) {
  if (event.target.id === molePosition) {
    score++;
    scoreDisplay.textContent = score;
    molePosition = null; // Reset mole position
  }
}

// Game timer
function startGame() {
  timerId = setInterval(randomMole, 800);
  const countdown = setInterval(() => {
    timeLeft--;
    timeLeftDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerId);
      clearInterval(countdown);
      alert(`Game Over! Your final score is: ${score}`);
    }
  }, 1000);
}

// Add event listeners
grid.addEventListener('click', whackMole);

// Initialize the game
createGrid();
startGame();
