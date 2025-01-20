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

function createGrid() {
  grid.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const square = document.createElement('div');
    square.classList.add('square');
    square.setAttribute('id', i);
    grid.appendChild(square);
  }
}

function randomMole() {
  document.querySelectorAll('.square').forEach(square => {
    square.classList.remove('mole', 'bonus-mole');
  });

  const randomSquare = grid.children[Math.floor(Math.random() * 9)];
  const isBonus = Math.random() > 0.8; // 20% chance for a bonus mole

  if (isBonus) {
    randomSquare.classList.add('bonus-mole');
    randomSquare.dataset.bonus = 'true';
  } else {
    randomSquare.classList.add('mole');
    randomSquare.dataset.bonus = 'false';
  }
  molePosition = randomSquare.id;
}

function whackMole(event) {
  if (event.target.id === molePosition) {
    const isBonus = event.target.dataset.bonus === 'true';
    score += isBonus ? 5 : 1;
    scoreDisplay.textContent = score;
    molePosition = null;

    event.target.style.transform = 'scale(0.9)';
    setTimeout(() => {
      event.target.style.transform = 'scale(1)';
    }, 100);
  }
}

function startCountdown() {
  countdownId = setInterval(() => {
    timeLeft--;
    timeLeftDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function adjustSpeed() {
  clearInterval(timerId);
  const newInterval = Math.max(300, 800 - score * 10);
  timerId = setInterval(randomMole, newInterval);
}

function endGame() {
  clearInterval(timerId);
  clearInterval(countdownId);
  grid.removeEventListener('click', whackMole);

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

function startGame() {
  score = 0;
  timeLeft = 30;
  scoreDisplay.textContent = score;
  timeLeftDisplay.textContent = timeLeft;

  startButton.disabled = true;
  createGrid();
  timerId = setInterval(randomMole, 800);
  startCountdown();
  grid.addEventListener('click', whackMole);
}

createGrid();
startButton.addEventListener('click', startGame);
