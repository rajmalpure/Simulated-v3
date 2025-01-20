class ConnectFour {
    constructor() {
        this.rows = 6;
        this.cols = 7;
        this.board = Array(this.rows).fill().map(() => Array(this.cols).fill(null));
        this.currentPlayer = 1;
        this.gameActive = true;
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
    }

    makeMove(col) {
        const row = this.getLowestEmptyRow(col);
        if (row === -1) return;

        this.board[row][col] = this.currentPlayer;
        this.updateCell(row, col);

        if (this.checkWin(row, col)) {
            this.gameActive = false;
            document.getElementById('result').textContent = `Player ${this.currentPlayer} wins!`;
            return;
        }

        if (this.checkDraw()) {
            this.gameActive = false;
            document.getElementById('result').textContent = "It's a draw!";
            return;
        }

        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        document.getElementById('current-player').textContent = `Player ${this.currentPlayer}`;
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

        return directions.some(dir => {
            const count = 1 +
                this.countDirection(row, col, dir[0][0], dir[0][1]) +
                this.countDirection(row, col, dir[1][0], dir[1][1]);
            return count >= 4;
        });
    }

    countDirection(row, col, rowDir, colDir) {
        let count = 0;
        let currentRow = row + rowDir;
        let currentCol = col + colDir;

        while (
            currentRow >= 0 && currentRow < this.rows &&
            currentCol >= 0 && currentCol < this.cols &&
            this.board[currentRow][currentCol] === this.currentPlayer
        ) {
            count++;
            currentRow += rowDir;
            currentCol += colDir;
        }

        return count;
    }

    checkDraw() {
        return this.board[0].every(cell => cell !== null);
    }

    reset() {
        this.board = Array(this.rows).fill().map(() => Array(this.cols).fill(null));
        this.currentPlayer = 1;
        this.gameActive = true;
        this.setupBoard();
        document.getElementById('current-player').textContent = 'Player 1';
        document.getElementById('result').textContent = '';
    }
}

let game = new ConnectFour();

function resetGame() {
    game.reset();
}