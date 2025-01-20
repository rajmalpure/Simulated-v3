class ConnectFour {
    constructor() {
        this.rows = 6;
        this.cols = 7;
        this.board = Array(this.rows).fill().map(() => Array(this.cols).fill(null));
        this.currentPlayer = 1;
        this.gameActive = true;
        this.scores = { 1: 0, 2: 0 };
        this.soundEnabled = true;
        this.winningCells = [];
        this.setupBoard();
        this.setupEventListeners();
    }

    setupBoard() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';
        
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.col = col;
                cell.dataset.row = row;
                boardElement.appendChild(cell);
            }
        }
    }

    setupEventListeners() {
        const boardElement = document.getElementById('board');
        boardElement.addEventListener('click', (e) => {
            if (!this.gameActive) return;
            
            const cell = e.target;
            if (cell.classList.contains('cell')) {
                const col = parseInt(cell.dataset.col);
                this.makeMove(col);
            }
        });

        document.getElementById('sound-toggle').addEventListener('change', (e) => {
            this.soundEnabled = e.target.checked;
        });
    }

    makeMove(col) {
        const row = this.getLowestEmptyRow(col);
        if (row === -1) {
            this.showMessage('Column is full! Try another column.');
            return;
        }

        this.board[row][col] = this.currentPlayer;
        this.updateCell(row, col);
        
        if (this.soundEnabled) {
            document.getElementById('drop-sound').play();
        }

        if (this.checkWin(row, col)) {
            this.gameActive = false;
            this.scores[this.currentPlayer]++;
            this.updateScores();
            this.highlightWinningCells();
            if (this.soundEnabled) {
                document.getElementById('win-sound').play();
            }
            this.showMessage(`Player ${this.currentPlayer} wins!`);
            return;
        }

        if (this.checkDraw()) {
            this.gameActive = false;
            this.showMessage("It's a draw!");
            return;
        }

        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        document.getElementById('current-player').textContent = `Player ${this.currentPlayer}`;
        this.showMessage('');
    }

    getLowestEmptyRow(col) {
        for (let row = this.rows - 1; row >= 0; row--) {
            if (!this.board[row][col]) {
                return row;
            }
        }
        return -1;
    }

    updateCell(row, col) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cell.classList.add(this.currentPlayer === 1 ? 'player-one' : 'player-two');
    }

    checkWin(row, col) {
        const directions = [
            [[0, 1], [0, -1]],  // Horizontal
            [[1, 0], [-1, 0]],  // Vertical
            [[1, 1], [-1, -1]], // Diagonal 1
            [[1, -1], [-1, 1]]  // Diagonal 2
        ];

        for (const dir of directions) {
            const cells = [[row, col]];
            let count = 1;

            for (const [rowDir, colDir] of dir) {
                let currentRow = row + rowDir;
                let currentCol = col + colDir;

                while (
                    currentRow >= 0 && currentRow < this.rows &&
                    currentCol >= 0 && currentCol < this.cols &&
                    this.board[currentRow][currentCol] === this.currentPlayer
                ) {
                    cells.push([currentRow, currentCol]);
                    count++;
                    currentRow += rowDir;
                    currentCol += colDir;
                }
            }

            if (count >= 4) {
                this.winningCells = cells;
                return true;
            }
        }

        return false;
    }

    highlightWinningCells() {
        this.winningCells.forEach(([row, col]) => {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            cell.classList.add('winner');
        });
    }

    checkDraw() {
        return this.board[0].every(cell => cell !== null);
    }

    updateScores() {
        document.getElementById('player1-score').textContent = this.scores[1];
        document.getElementById('player2-score').textContent = this.scores[2];
    }

    showMessage(message) {
        document.getElementById('message').textContent = message;
    }

    reset() {
        this.board = Array(this.rows).fill().map(() => Array(this.cols).fill(null));
        this.currentPlayer = 1;
        this.gameActive = true;
        this.winningCells = [];
        this.setupBoard();
        document.getElementById('current-player').textContent = 'Player 1';
        this.showMessage('');
    }

    newGame() {
        this.scores = { 1: 0, 2: 0 };
        this.updateScores();
        this.reset();
    }
}

let game = new ConnectFour();

function resetGame() {
    game.reset();
}

function newGame() {
    game.newGame();
}

function changeTheme() {
    const theme = document.getElementById('theme').value;
    document.body.className = theme;
}