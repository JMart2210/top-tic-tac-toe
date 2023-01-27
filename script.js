/* eslint-disable no-underscore-dangle */

const gameBoardModule = (function () {
  function _createBoard() {
    // create container and buttons
    const container = document.querySelector('.gameContainer');
    const btn1 = document.createElement('button');
    btn1.classList.add('gameBtn', 'top', 'left');
    btn1.dataset.id = '1';
    const btn2 = document.createElement('button');
    btn2.classList.add('gameBtn', 'btn2', 'top');
    btn2.dataset.id = '2';
    const btn3 = document.createElement('button');
    btn3.classList.add('gameBtn', 'btn3', 'top', 'right');
    btn3.dataset.id = '3';
    const btn4 = document.createElement('button');
    btn4.classList.add('gameBtn', 'btn4', 'mid', 'left');
    btn4.dataset.id = '4';
    const btn5 = document.createElement('button');
    btn5.classList.add('gameBtn', 'btn5', 'mid');
    btn5.dataset.id = '5';
    const btn6 = document.createElement('button');
    btn6.classList.add('gameBtn', 'btn6', 'mid', 'right');
    btn6.dataset.id = '6';
    const btn7 = document.createElement('button');
    btn7.classList.add('gameBtn', 'btn7', 'bot', 'left');
    btn7.dataset.id = '7';
    const btn8 = document.createElement('button');
    btn8.classList.add('gameBtn', 'btn8', 'bot');
    btn8.dataset.id = '8';
    const btn9 = document.createElement('button');
    btn9.classList.add('gameBtn', 'btn9', 'bot', 'right');
    btn9.dataset.id = '9';
    // create rows
    const row1 = document.createElement('div');
    row1.classList.add('row1', 'top');
    const row2 = document.createElement('div');
    row2.classList.add('row2', 'mid');
    const row3 = document.createElement('div');
    row3.classList.add('row3', 'bot');
    // append rows & buttons
    container.append(row1, row2, row3);
    row1.append(btn1, btn2, btn3);
    row2.append(btn4, btn5, btn6);
    row3.append(btn7, btn8, btn9);
  }
  function getBoard() {
    _createBoard();
  }
  function updateBoard(e) {
    if (this.textContent) return;
    this.textContent = 'X';
    console.log(e.target.dataset.id);
  }
  return { getBoard, updateBoard };
}());

gameBoardModule.getBoard();

const gameBtns = document.querySelectorAll('.gameBtn');

gameBtns.forEach((button) => button.addEventListener('click', gameBoardModule.updateBoard));
