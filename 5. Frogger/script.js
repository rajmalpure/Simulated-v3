document.addEventListener('DOMContentLoaded', () => {
    const timeLeftDisplay = document.querySelector('#time-left');
    const resultDisplay = document.querySelector('#result');
    const startBtn = document.querySelector('#start-button');
    const grid = document.querySelector('.grid');
    const width = 9;
    const squares = [];
    
    let currentIndex = 76;
    let timerId;
    let outcomeTimerId;
    let currentTime = 20;
    
    // Create game grid
    function createBoard() {
        for (let i = 0; i < 81; i++) {
            const square = document.createElement('div');
            
            // Add classes based on row position
            if (i === 0) {
                square.classList.add('ending-block');
            } else if (i >= 1 && i <= 8) {
                square.classList.add('safe');
            } else if (i >= 9 && i <= 17) {
                square.classList.add('car-left');
            } else if (i >= 18 && i <= 26) {
                square.classList.add('safe');
            } else if (i >= 27 && i <= 35) {
                square.classList.add('car-right');
            } else if (i >= 36 && i <= 44) {
                square.classList.add('safe');
            } else if (i >= 45 && i <= 53) {
                square.classList.add('water');
            } else if (i >= 54 && i <= 62) {
                square.classList.add('log-left');
            } else if (i >= 63 && i <= 71) {
                square.classList.add('log-right');
            } else if (i >= 72 && i <= 80) {
                square.classList.add('safe');
            }
            if (i === 76) {
                square.classList.add('starting-block');
            }
            
            grid.appendChild(square);
            squares.push(square);
        }
    }
    createBoard();

    // Add frog to starting position
    squares[currentIndex].classList.add('frog');

    // Move frog
    function moveFrog(e) {
        squares[currentIndex].classList.remove('frog');
        
        switch(e.key) {
            case 'ArrowLeft':
                if (currentIndex % width !== 0) currentIndex -= 1;
                break;
            case 'ArrowRight':
                if (currentIndex % width < width - 1) currentIndex += 1;
                break;
            case 'ArrowUp':
                if (currentIndex - width >= 0) currentIndex -= width;
                break;
            case 'ArrowDown':
                if (currentIndex + width < width * width) currentIndex += width;
                break;
        }
        
        squares[currentIndex].classList.add('frog');
    }

    // Move elements
    function autoMoveElements() {
        let leftLogs = document.querySelectorAll('.log-left');
        let rightLogs = document.querySelectorAll('.log-right');
        let leftCars = document.querySelectorAll('.car-left');
        let rightCars = document.querySelectorAll('.car-right');
        
        moveLogLeft(leftLogs);
        moveLogRight(rightLogs);
        moveCarLeft(leftCars);
        moveCarRight(rightCars);
    }

    // Move logs
    function moveLogLeft(leftLogs) {
        leftLogs.forEach(log => {
            let lastClass = log.classList[1];
            if (lastClass === 'l5') {
                log.classList.remove('l5');
                log.classList.add('l1');
            }
            moveClass(log, 'log-left');
        });
    }

    function moveLogRight(rightLogs) {
        rightLogs.forEach(log => {
            let lastClass = log.classList[1];
            if (lastClass === 'l1') {
                log.classList.remove('l1');
                log.classList.add('l5');
            }
            moveClass(log, 'log-right');
        });
    }

    // Move cars
    function moveCarLeft(leftCars) {
        leftCars.forEach(car => moveClass(car, 'car-left'));
    }

    function moveCarRight(rightCars) {
        rightCars.forEach(car => moveClass(car, 'car-right'));
    }

    function moveClass(element, className) {
        let currentClasses = [...element.classList];
        element.classList.remove(...currentClasses);
        element.nextElementSibling?.classList.add(...currentClasses);
    }

    // Check for win/lose
    function checkOutcomes() {
        lose();
        win();
    }

    // Lose conditions
    function lose() {
        if (
            squares[currentIndex].classList.contains('car-left') ||
            squares[currentIndex].classList.contains('car-right') ||
            squares[currentIndex].classList.contains('water') ||
            currentTime <= 0
        ) {
            resultDisplay.textContent = 'You lose!';
            clearInterval(timerId);
            clearInterval(outcomeTimerId);
            squares[currentIndex].classList.remove('frog');
            document.removeEventListener('keyup', moveFrog);
        }
    }

    // Win condition
    function win() {
        if (squares[currentIndex].classList.contains('ending-block')) {
            resultDisplay.textContent = 'You win!';
            clearInterval(timerId);
            clearInterval(outcomeTimerId);
            document.removeEventListener('keyup', moveFrog);
        }
    }

    // Start/Pause game
    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId);
            clearInterval(outcomeTimerId);
            outcomeTimerId = null;
            timerId = null;
            document.removeEventListener('keyup', moveFrog);
            startBtn.textContent = 'Start';
        } else {
            timerId = setInterval(autoMoveElements, 1000);
            outcomeTimerId = setInterval(checkOutcomes, 50);
            document.addEventListener('keyup', moveFrog);
            startBtn.textContent = 'Pause';
            
            // Reset timer
            currentTime = 20;
            timeLeftDisplay.textContent = currentTime;
            
            // Start countdown
            let timeCountdown = setInterval(() => {
                currentTime--;
                timeLeftDisplay.textContent = currentTime;
                if (currentTime <= 0) {
                    clearInterval(timeCountdown);
                }
            }, 1000);
        }
    });
});