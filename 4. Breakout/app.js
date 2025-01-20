// app.js
class Block {
    constructor(xAxis, yAxis, color = '#ff6b6b') {
        this.bottomLeft = [xAxis, yAxis];
        this.bottomRight = [xAxis + blockWidth, yAxis];
        this.topLeft = [xAxis, yAxis + blockHeight];
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
        this.color = color;
    }
}

const boardWidth = 840;
const boardHeight = 480;
const blockWidth = 150;
const blockHeight = 30;
const ballDiameter = 20;
const userStart = [345, 10];
const ballStart = [395, 40];

// DOM elements
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const scoreDisplay = document.querySelector('#score');
    const livesDisplay = document.querySelector('#lives');
    const startButton = document.querySelector('#start-button');
    const restartButton = document.querySelector('#restart-button');
    const playAgainButton = document.querySelector('#play-again-button');
    const gameOverDisplay = document.querySelector('.game-over');
    const winMessageDisplay = document.querySelector('.win-message');
    const finalScoreDisplay = document.querySelector('#final-score');

    let currentPosition = [...userStart];
    let ballCurrentPosition = [...ballStart];
    let timerId;
    let ballSpeed = 5;
    let ballXSpeed = ballSpeed;
    let ballYSpeed = ballSpeed;
    let score = 0;
    let lives = 3;
    let blocks = [];
    let isGamePaused = false;

    const blockColors = ['#ff6b6b', '#ffd93d', '#6c5ce7', '#a8e6cf', '#ff8b94'];

    function addBlocks() {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                const block = new Block(
                    j * (blockWidth + 10) + 10,
                    i * (blockHeight + 10) + 200,
                    blockColors[i]
                );
                blocks.push(block);
            }
        }
    }

    function drawBlocks() {
        blocks.forEach(block => {
            const blockElement = document.createElement('div');
            blockElement.classList.add('block');
            blockElement.style.left = block.bottomLeft[0] + 'px';
            blockElement.style.bottom = block.bottomLeft[1] + 'px';
            blockElement.style.background = `linear-gradient(45deg, ${block.color}, ${lightenColor(block.color, 20)})`;
            grid.appendChild(blockElement);
        });
    }

    function lightenColor(color, percent) {
        const num = parseInt(color.slice(1), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return `#${(R << 16 | G << 8 | B).toString(16).padStart(6, '0')}`;
    }

    function drawUser() {
        const user = document.querySelector('.user') || document.createElement('div');
        user.classList.add('user');
        user.style.left = currentPosition[0] + 'px';
        user.style.bottom = currentPosition[1] + 'px';
        if (!grid.contains(user)) grid.appendChild(user);
    }

    function drawBall() {
        const ball = document.querySelector('.ball') || document.createElement('div');
        ball.classList.add('ball');
        ball.style.left = ballCurrentPosition[0] + 'px';
        ball.style.bottom = ballCurrentPosition[1] + 'px';
        if (!grid.contains(ball)) grid.appendChild(ball);
    }

    function moveBall() {
        if (isGamePaused) return;

        ballCurrentPosition[0] += ballXSpeed;
        ballCurrentPosition[1] += ballYSpeed;

        // Wall collisions
        if (ballCurrentPosition[0] >= boardWidth - ballDiameter || ballCurrentPosition[0] <= 0) {
            ballXSpeed *= -1;
        }
        if (ballCurrentPosition[1] >= boardHeight - ballDiameter) {
            ballYSpeed *= -1;
        }

        // Paddle collision
        if (
            ballCurrentPosition[1] <= currentPosition[1] + blockHeight &&
            ballCurrentPosition[0] > currentPosition[0] &&
            ballCurrentPosition[0] < currentPosition[0] + blockWidth
        ) {
            ballYSpeed *= -1;
        }

        // Block collisions
        blocks.forEach((block, index) => {
            if (
                ballCurrentPosition[0] + ballDiameter > block.bottomLeft[0] &&
                ballCurrentPosition[0] < block.bottomRight[0] &&
                ballCurrentPosition[1] + ballDiameter > block.bottomLeft[1] &&
                ballCurrentPosition[1] < block.topLeft[1]
            ) {
                const allBlocks = Array.from(document.querySelectorAll('.block'));
                allBlocks[index].remove();
                blocks.splice(index, 1);
                ballYSpeed *= -1;
                score += 10;
                scoreDisplay.textContent = score;

                if (blocks.length === 0) winGame();
            }
        });

        // Lose life
        if (ballCurrentPosition[1] <= 0) handleLifeLost();

        drawBall();
    }

    function handleLifeLost() {
        lives--;
        livesDisplay.textContent = lives;
        if (lives === 0) gameOver();
        else resetBall();
    }

    function resetBall() {
        ballCurrentPosition = [...ballStart];
        ballSpeed = 5;
        ballXSpeed = ballSpeed;
        ballYSpeed = ballSpeed;
        drawBall();
    }

    function winGame() {
        clearInterval(timerId);
        winMessageDisplay.classList.remove('hidden');
    }

    function gameOver() {
        clearInterval(timerId);
        gameOverDisplay.classList.remove('hidden');
        finalScoreDisplay.textContent = score;
    }

    function startGame() {
        // Reset game state
        grid.innerHTML = '';
        currentPosition = [...userStart];
        ballCurrentPosition = [...ballStart];
        blocks = [];
        score = 0;
        lives = 3;
        ballSpeed = 5;
        ballXSpeed = ballSpeed;
        ballYSpeed = ballSpeed;
        scoreDisplay.textContent = score;
        livesDisplay.textContent = lives;

        gameOverDisplay.classList.add('hidden');
        winMessageDisplay.classList.add('hidden');

        addBlocks();
        drawBlocks();
        drawUser();
        drawBall();

        timerId = setInterval(moveBall, 20);
        document.addEventListener('keydown', moveUser);
    }

    function moveUser(e) {
        switch (e.key) {
            case 'ArrowLeft':
                if (currentPosition[0] > 0) currentPosition[0] -= 20;
                break;
            case 'ArrowRight':
                if (currentPosition[0] < boardWidth - blockWidth) currentPosition[0] += 20;
                break;
        }
        drawUser();
    }

    
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', startGame);
    playAgainButton.addEventListener('click', startGame);
});
