const grid = document.querySelector('.grid');
const scoreDisplay = document.getElementById('score');
const timeLeftDisplay = document.getElementById('time-left');
const startButton = document.getElementById('start-button');
const highScoreDisplay = document.getElementById('high-score');

let score = 0;
let timeLeft = 30;
let molePosition = null;
let timerId = null;
let countdownId = null;
let highScore = localStorage.getItem('whacAMoleHighScore') || 0;
highScoreDisplay.textContent = highScore;

// Create grid squares dynamically
function createGrid() {
  grid.innerHTML = '';
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

// Handle click event for registering hits
function whackMole(event) {
  if (event.target.id === molePosition) {
    score++;
    scoreDisplay.textContent = score;
    molePosition = null;
    
    // Add hit animation
    event.target.style.transform = 'scale(0.9)';
    setTimeout(() => {
      event.target.style.transform = 'scale(1)';
    }, 100);
  }
}

// Game timer
function startCountdown() {
  countdownId = setInterval(() => {
    timeLeft--;
    timeLeftDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  clearInterval(timerId);
  clearInterval(countdownId);
  grid.removeEventListener('click', whackMole);
  
  // Update high score
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('whacAMoleHighScore', highScore);
    highScoreDisplay.textContent = highScore;
    alert(`New High Score: ${score}! 🎉`);
  } else {
    alert(`Game Over! Your score: ${score}`);
  }

  startButton.disabled = false;
}

// Start the game
function startGame() {
  // Reset game state
  score = 0;
  timeLeft = 30;
  scoreDisplay.textContent = score;
  timeLeftDisplay.textContent = timeLeft;
  
  // Disable start button during game
  startButton.disabled = true;
  
  createGrid();
  timerId = setInterval(randomMole, 800);
  startCountdown();
  grid.addEventListener('click', whackMole);
}

// Initialize the game
createGrid();
startButton.addEventListener('click', startGame);