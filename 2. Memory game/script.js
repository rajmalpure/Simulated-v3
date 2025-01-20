document.addEventListener('DOMContentLoaded', () => {
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let moves = 0;
    let matches = 0;
    let gameTime = 0;
    let gameTimer;
    let bestTime = localStorage.getItem('bestTime') || null;

    const gameBoard = document.getElementById('game-board');
    const movesDisplay = document.getElementById('moves');
    const matchesDisplay = document.getElementById('matches');
    const timeDisplay = document.getElementById('time');
    const bestTimeDisplay = document.getElementById('best-time');
    const restartButton = document.getElementById('restart');
    const playAgainButton = document.getElementById('play-again');
    const winMessage = document.getElementById('win-message');
    const difficultySelect = document.getElementById('difficulty');

    const cardImages = [
        'assets/cheeseburger.png',
        'assets/fries.png',
        'assets/hotdog.png',
        'assets/ice-cream.png',
        'assets/milkshake.png',
        'assets/pizza.png'
    ];

    function initializeGame() {
        moves = 0;
        matches = 0;
        gameTime = 0;
        firstCard = null;
        secondCard = null;
        hasFlippedCard = false;

        clearInterval(gameTimer);
        startTimer();

        const pairs = difficultySelect.value === 'easy' ? 4 : difficultySelect.value === 'medium' ? 6 : 8;
        const cards = [...cardImages.slice(0, pairs), ...cardImages.slice(0, pairs)];
        createBoard(cards);

        bestTimeDisplay.textContent = bestTime ? formatTime(bestTime) : '--:--';
    }

    function startTimer() {
        gameTimer = setInterval(() => {
            gameTime++;
            timeDisplay.textContent = formatTime(gameTime);
        }, 1000);
    }

    function createBoard(cards) {
        const shuffled = shuffle(cards);
        gameBoard.innerHTML = '';
        shuffled.forEach(image => {
            const card = createCard(image);
            gameBoard.appendChild(card);
        });
    }

    function createCard(image) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.image = image;

        const front = document.createElement('div');
        front.className = 'card-front';

        const back = document.createElement('div');
        back.className = 'card-back';
        back.innerHTML = `<img src="${image}" alt="Card Image">`;

        card.appendChild(front);
        card.appendChild(back);

        card.addEventListener('click', flipCard);
        return card;
    }

    function flipCard() {
        if (lockBoard || this === firstCard || this.classList.contains('matched')) return;

        this.classList.add('flipped');
        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        secondCard = this;
        checkMatch();
    }

    function checkMatch() {
        const isMatch = firstCard.dataset.image === secondCard.dataset.image;
        if (isMatch) {
            matches++;
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            resetBoard();
            if (matches === cardImages.length) {
                endGame();
            }
        } else {
            lockBoard = true;
            setTimeout(() => {
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
                resetBoard();
            }, 1500);
        }
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
        moves++;
        movesDisplay.textContent = moves;
    }

    function endGame() {
        clearInterval(gameTimer);
        const currentTime = gameTime;
        if (!bestTime || currentTime < bestTime) {
            bestTime = currentTime;
            localStorage.setItem('bestTime', bestTime);
        }
        winMessage.classList.add('show');
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    function shuffle(array) {
        return array.sort(() => 0.5 - Math.random());
    }

    restartButton.addEventListener('click', initializeGame);
    playAgainButton.addEventListener('click', () => {
        winMessage.classList.remove('show');
        initializeGame();
    });

    difficultySelect.addEventListener('change', initializeGame);

    initializeGame();
});
