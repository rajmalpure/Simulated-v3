class Block {
    constructor(xAxis, yAxis) {
        this.bottomLeft = [xAxis, yAxis];
        this.bottomRight = [xAxis + 100, yAxis];
        this.topLeft = [xAxis, yAxis + 20];
        this.topRight = [xAxis + 100, yAxis + 20];
    }
}

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

    const boardWidth = 560;
    const boardHeight = 300;
    const blockWidth = 100;
    const blockHeight = 20;
    const ballDiameter = 16;
    const userStart = [230, 10];
    const ballStart = [270, 30];

    let currentPosition = userStart;
    let ballCurrentPosition = ballStart;
    let timerId;
    let xDirection = 2;
    let yDirection = 2;
    let score = 0;
    let lives = 3;
    let blocks = [];

    // Create Block
    class Block {
        constructor(xAxis, yAxis) {
            this.bottomLeft = [xAxis, yAxis];
            this.bottomRight = [xAxis + blockWidth, yAxis];
            this.topLeft = [xAxis, yAxis + blockHeight];
            this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
        }
    }

    // Add blocks
    function addBlocks() {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                blocks.push(new Block(j * (blockWidth + 10) + 10, (i * (blockHeight + 10)) + 200));
            }
        }
    }

    // Draw blocks
    function drawBlocks() {
        for (let i = 0; i < blocks.length; i++) {
            const block = document.createElement('div');
            block.classList.add('block');
            block.style.left = blocks[i].bottomLeft[0] + 'px';
            block.style.bottom = blocks[i].bottomLeft[1] + 'px';
            grid.appendChild(block);
        }
    }

    // Add user
    const user = document.createElement('div');
    user.classList.add('user');

    // Draw user
    function drawUser() {
        user.style.left = currentPosition[0] + 'px';
        user.style.bottom = currentPosition[1] + 'px';
    }

    // Draw ball
    function drawBall() {
        ball.style.left = ballCurrentPosition[0] + 'px';
        ball.style.bottom = ballCurrentPosition[1] + 'px';
    }

    // Move user
    function moveUser(e) {
        switch(e.key) {
            case 'ArrowLeft':
                if (currentPosition[0] > 0) {
                    currentPosition[0] -= 20;
                    drawUser();
                }
                break;
            case 'ArrowRight':
                if (currentPosition[0] < boardWidth - blockWidth) {
                    currentPosition[0] += 20;
                    drawUser();
                }
                break;
        }
    }

    // Add ball
    const ball = document.createElement('div');
    ball.classList.add('ball');

    // Move ball
    function moveBall() {
        ballCurrentPosition[0] += xDirection;
        ballCurrentPosition[1] += yDirection;
        drawBall();
        checkForCollisions();
    }

    // Check for collisions
    function checkForCollisions() {
        // Check block collisions
        for (let i = 0; i < blocks.length; i++) {
            if (
                (ballCurrentPosition[0] > blocks[i].bottomLeft[0] &&
                    ballCurrentPosition[0] < blocks[i].bottomRight[0]) &&
                (ballCurrentPosition[1] + ballDiameter > blocks[i].bottomLeft[1] &&
                    ballCurrentPosition[1] < blocks[i].topLeft[1])
            ) {
                const allBlocks = Array.from(document.querySelectorAll('.block'));
                allBlocks[i].remove();
                blocks.splice(i, 1);
                changeDirection();
                score += 10;
                scoreDisplay.innerHTML = score;

                // Check for win
                if (blocks.length === 0) {
                    winGame();
                }
            }
        }

        // Check wall collisions
        if (
            ballCurrentPosition[0] >= boardWidth - ballDiameter ||
            ballCurrentPosition[1] >= boardHeight - ballDiameter ||
            ballCurrentPosition[0] <= 0
        ) {
            changeDirection();
        }

        // Check user collisions
        if (
            (ballCurrentPosition[0] > currentPosition[0] &&
                ballCurrentPosition[0] < currentPosition[0] + blockWidth) &&
            (ballCurrentPosition[1] > currentPosition[1] &&
                ballCurrentPosition[1] < currentPosition[1] + blockHeight)
        ) {
            changeDirection();
        }

        // Check for game over
        if (ballCurrentPosition[1] <= 0) {
            lives--;
            livesDisplay.innerHTML = lives;
            
            if (lives <= 0) {
                gameOver();
            } else {
                resetBall();
            }
        }
    }

    function changeDirection() {
        if (xDirection === 2 && yDirection === 2) {
            yDirection = -2;
            return;
        }
        if (xDirection === 2 && yDirection === -2) {
            xDirection = -2;
            return;
        }
        if (xDirection === -2 && yDirection === -2) {
            yDirection = 2;
            return;
        }
        if (xDirection === -2 && yDirection === 2) {
            xDirection = 2;
            return;
        }
    }

    function resetBall() {
        ballCurrentPosition = [...ballStart];
        xDirection = 2;
        yDirection = 2;
        drawBall();
    }

    function gameOver() {
        clearInterval(timerId);
        document.removeEventListener('keydown', moveUser);
        gameOverDisplay.classList.remove('hidden');
        finalScoreDisplay.innerHTML = score;
    }

    function winGame() {
        clearInterval(timerId);
        document.removeEventListener('keydown', moveUser);
        winMessageDisplay.classList.remove('hidden');
    }

    function startGame() {
        // Reset game state
        blocks = [];
        score = 0;
        lives = 3;
        scoreDisplay.innerHTML = score;
        livesDisplay.innerHTML = lives;
        currentPosition = [...userStart];
        ballCurrentPosition = [...ballStart];
        xDirection = 2;
        yDirection = 2;

        // Clear the grid
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild);
        }

        // Hide messages
        gameOverDisplay.classList.add('hidden');
        winMessageDisplay.classList.add('hidden');

        // Set up game
        addBlocks();
        drawBlocks();
        grid.appendChild(user);
        drawUser();
        grid.appendChild(ball);
        drawBall();

        // Start game loop
        timerId = setInterval(moveBall, 20);
        document.addEventListener('keydown', moveUser);
    }

    // Event listeners
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', startGame);
    playAgainButton.addEventListener('click', startGame);
})