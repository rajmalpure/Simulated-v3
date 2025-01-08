function playGame(playerChoice) {
    // Computer's choice
    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * 3)];

    // Determine the winner
    let result;
    if (playerChoice === computerChoice) {
        result = "It's a tie!";
    } else if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'scissors' && computerChoice === 'paper') ||
        (playerChoice === 'paper' && computerChoice === 'rock')
    ) {
        result = "You win!";
    } else {
        result = "You lose!";
    }

    // Display result
    document.getElementById('result').textContent = `You chose ${playerChoice}, computer chose ${computerChoice}. ${result}`;
}
