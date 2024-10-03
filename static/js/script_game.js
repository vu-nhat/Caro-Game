document.addEventListener('DOMContentLoaded', () => {
    const boardSizeCol = 50;
    const boardSizeRow = 25;
    const cellSize = 30;
    const gameBoard = document.getElementById('game-board');
    const messageDiv = document.getElementById('message');
    const resetButton = document.getElementById('reset-btn');
    const token = sessionStorage.getItem('token');

    // Khởi tạo bàn cờ
    function createBoard() {
        gameBoard.innerHTML = '';  // Reset bàn cờ
        for (let row = 0; row < boardSizeRow; row++) {
            for (let col = 0; col < boardSizeCol; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('click', handleMove);
                gameBoard.appendChild(cell);
            }
        }
    }

    // Xử lý click vào ô
    function handleMove(event) {
        const cell = event.target;
        const row = cell.dataset.row;
        const col = cell.dataset.col;

        fetch(`http://127.0.0.1:8080/game/move?row=${row}&col=${col}`, { method: 'POST', headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        } })
            .then(response => response.json())
            .then(data => {
                messageDiv.textContent = data.status;
                if (data.status.includes('continue')) {
                    cell.textContent = data.symbolCurrentPlayer;
                    const cellOpponent = document.querySelector(`.cell[data-row='${data.coordinatesOpponent[0]}'][data-col='${data.coordinatesOpponent[1]}']`);
                    if (cellOpponent) {
                        cellOpponent.textContent = data.symbolOpponentPlayer;
                    }
                }
                if (data.status.includes('wins')) {
                    cell.textContent = data.symbolCurrentPlayer;
                    if (data.coordinatesOpponent) {
                        const cellOpponent = document.querySelector(`.cell[data-row='${data.coordinatesOpponent[0]}'][data-col='${data.coordinatesOpponent[1]}']`);
                        if (cellOpponent) {
                            cellOpponent.textContent = data.symbolOpponentPlayer;
                        }
                    }
                    
                    disableBoard();
                    const firstCoordinate = data.coordinatesWin[0];
                    const lastCoordinate = data.coordinatesWin[1];
                    drawLine(firstCoordinate, lastCoordinate);
                }
            });
    }

    function drawLine(firstCoordinate, lastCoordinate) {
        const canvas = document.getElementById('line-canvas');
        const gameBoard = document.getElementById('game-board');

        // Đặt kích thước canvas bằng với bảng cờ caro
        canvas.width = gameBoard.clientWidth;
        canvas.height = gameBoard.clientHeight;

        const ctx = canvas.getContext('2d');

        // Convert coordinates to canvas coordinates
        const x1 = firstCoordinate[1] * cellSize + cellSize / 2;
        const y1 = firstCoordinate[0] * cellSize + cellSize / 2;
        const x2 = lastCoordinate[1] * cellSize + cellSize / 2;
        const y2 = lastCoordinate[0] * cellSize + cellSize / 2;

        // Draw the line
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        // Styling
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'red';

        // Stroke the line
        ctx.stroke();
    }

    // Vô hiệu hóa bàn cờ sau khi có người thắng
    function disableBoard() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => cell.removeEventListener('click', handleMove));
    }

    // Chơi lại game
    resetButton.addEventListener('click', () => {
        fetch('http://127.0.0.1:8080/game/reset?row=' + boardSizeRow + '&col=' + boardSizeCol, { method: 'POST', headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        } })
            .then(() => {
                messageDiv.textContent = 'Game đã được reset!';
                createBoard();
                clearLine();
            });
    });

    function clearLine() {
        const canvas = document.getElementById('line-canvas');
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Khởi tạo game khi load trang
    createBoard();
});
