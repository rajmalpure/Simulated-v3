let playerWins = 0;
let computerWins = 0;
let ties = 0;

// Sound effects
const winSound = new Audio('win.mp3');
const loseSound = new Audio('lose.mp3');
const tieSound = new Audio('tie.mp3');

function playGame(playerChoice) {
    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * 3)];
    let result;

    // Determine the result
    if (playerChoice === computerChoice) {
        result = "It's a tie!";
        ties++;
        tieSound.play();
    } else if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'scissors' && computerChoice === 'paper') ||
        (playerChoice === 'paper' && computerChoice === 'rock')
    ) {
        result = "You win!";
        playerWins++;
        winSound.play();
    } else {
        result = "You lose!";
        computerWins++;
        loseSound.play();
    }

    // Update the UI
    updateUI(playerChoice, computerChoice, result);
}

function updateUI(playerChoice, computerChoice, result) {
    const resultDisplay = document.getElementById('result');
    resultDisplay.textContent = `You chose ${playerChoice}, computer chose ${computerChoice}. ${result}`;
    resultDisplay.classList.add('result-animate');

    // Remove animation after it completes
    setTimeout(() => resultDisplay.classList.remove('result-animate'), 500);

    document.getElementById('playerWins').textContent = playerWins;
    document.getElementById('computerWins').textContent = computerWins;
    document.getElementById('ties').textContent = ties;
}

function resetGame() {
    playerWins = 0;
    computerWins = 0;
    ties = 0;

    document.getElementById('playerWins').textContent = playerWins;
    document.getElementById('computerWins').textContent = computerWins;
    document.getElementById('ties').textContent = ties;
    document.getElementById('result').textContent = "Make your choice to start the game!";
}
