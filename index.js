document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById('minesweeper');
    const width = 10;
    const height = 10;
    const minesCount = 20;
    const cells = [];
    let gameOver = false;

    function createBoard() {
        const minesArray = Array(minesCount).fill('mine');
        const emptyArray = Array(width * height - minesCount).fill('empty');
        const gameArray = emptyArray.concat(minesArray);
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

        for (let i = 0; i < width * height; i++) {
            const cell = document.createElement('div');
            cell.setAttribute('id', i);
            cell.classList.add('cell');
            cell.addEventListener('click', () => click(cell));
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                addFlag(cell);
            });
            grid.appendChild(cell);
            cells.push(cell);

            if (shuffledArray[i] === 'mine') {
                cell.classList.add('mine');
                // Initially hide mines
                cell.classList.add('hidden-mine');
            } else {
                cell.setAttribute('data', 0);
            }
        }

        for (let i = 0; i < cells.length; i++) {
            const isLeftEdge = i % width === 0;
            const isRightEdge = i % width === width - 1;

            if (shuffledArray[i] !== 'mine') {
                let total = 0;
                if (i > 0 && !isLeftEdge && cells[i - 1].classList.contains('mine')) total++;
                if (i > 9 && !isRightEdge && cells[i + 1 - width].classList.contains('mine')) total++;
                if (i > 10 && cells[i - width].classList.contains('mine')) total++;
                if (i > 11 && !isLeftEdge && cells[i - 1 - width].classList.contains('mine')) total++;
                if (i < 98 && !isRightEdge && cells[i + 1].classList.contains('mine')) total++;
                if (i < 90 && !isLeftEdge && cells[i - 1 + width].classList.contains('mine')) total++;
                if (i < 88 && !isRightEdge && cells[i + 1 + width].classList.contains('mine')) total++;
                if (i < 89 && cells[i + width].classList.contains('mine')) total++;
                cells[i].setAttribute('data', total);
            }
        }
    }

    function addFlag(cell) {
        if (gameOver) return;
        if (!cell.classList.contains('revealed') && (cell.classList.contains('flag'))) {
            cell.classList.remove('flag');
            cell.innerHTML = '';
        } else if (!cell.classList.contains('revealed')) {
            cell.classList.add('flag');
            cell.innerHTML = '🚩';
        }
    }

    function click(cell) {
        if (gameOver) return;
        if (cell.classList.contains('revealed') || cell.classList.contains('flag')) return;
        if (cell.classList.contains('mine')) {
            gameOver = true;
            cell.classList.add('revealed');
            revealMines();
            alert('Game Over!');
            return;
        }

        cell.classList.add('revealed');
        const total = cell.getAttribute('data');
        if (total != 0) {
            cell.innerHTML = total;
            return;
        }

        const cellId = parseInt(cell.id);
        const isLeftEdge = cellId % width === 0;
        const isRightEdge = cellId % width === width - 1;

        setTimeout(() => {
            if (cellId > 0 && !isLeftEdge) {
                const newId = cells[cellId - 1].id;
                const newCell = document.getElementById(newId);
                click(newCell);
            }
            if (cellId > 9 && !isRightEdge) {
                const newId = cells[cellId + 1 - width].id;
                const newCell = document.getElementById(newId);
                click(newCell);
            }
            if (cellId > 10) {
                const newId = cells[cellId - width].id;
                const newCell = document.getElementById(newId);
                click(newCell);
            }
            if (cellId > 11 && !isLeftEdge) {
                const newId = cells[cellId - 1 - width].id;
                const newCell = document.getElementById(newId);
                click(newCell);
            }
            if (cellId < 98 && !isRightEdge) {
                const newId = cells[cellId + 1].id;
                const newCell = document.getElementById(newId);
                click(newCell);
            }
            if (cellId < 90 && !isLeftEdge) {
                const newId = cells[cellId - 1 + width].id;
                const newCell = document.getElementById(newId);
                click(newCell);
            }
            if (cellId < 88 && !isRightEdge) {
                const newId = cells[cellId + 1 + width].id;
                const newCell = document.getElementById(newId);
                click(newCell);
            }
            if (cellId < 89) {
                const newId = cells[cellId + width].id;
                const newCell = document.getElementById(newId);
                click(newCell);
            }
        }, 10);
    }

    function revealMines() {
        cells.forEach(cell => {
            if (cell.classList.contains('mine')) {
                cell.classList.add('revealed');
                cell.classList.remove('hidden-mine');
                cell.innerHTML = '💣';
            }
        });
    }

    createBoard();
});
