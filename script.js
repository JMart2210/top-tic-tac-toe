/* eslint-disable no-underscore-dangle */

const Player = (name) => {
  const side = 'X';
  return { name, side };
};

const gamePlayModule = (function () {
  const gameBoard = ['0', '', '', '', '', '', '', '', '', ''];
  let xValues = [];
  let oValues = [];
  const player2 = false;
  let winner = false;
  const side = 'X';
  let turn = 0;
  const cpuChoice = null;
  const winningCombos = [
    [1, 2, 3],
    [1, 4, 7],
    [1, 5, 9],
    [2, 5, 8],
    [3, 5, 7],
    [3, 6, 9],
    [4, 5, 6],
    [7, 8, 9]];
  function gameOver(xOrO) {
    console.log(xOrO);
    document.querySelector(`.${xOrO}`).classList.add('visible');
  }
  function compareArray(testArray, ansArray) {
    return ansArray.every((el) => testArray.includes(el));
  }
  function clickMove(space) {
    const move = space.dataset.id;
    updateGameBoard(move, side);
    if (checkForWinner()) gameOver(side);
    else {
      if (player2) return;
      if (++turn > 4) return;
      updateGameBoard(getComputerChoice(), 'O');
      if (checkForWinner()) gameOver('O');
    }
  }
  function updateGameBoard(move, xOrO) {
    gameBoard[move] = xOrO;
    if (xOrO === 'X') xValues.push(+move);
    else oValues.push(move);
    gameBoardModule.updateDisplay(move, xOrO);
  }
  function getComputerChoice() {
    let choice = '0';
    const options = gameBoard.map((_, n) => n).filter((n) => gameBoard[n] === '');
    while (choice === '0') {
      choice = options[Math.floor(Math.random() * options.length)];
    }
    return choice;
  }
  function checkForWinner() {
    console.log(xValues, oValues);
    // const xValues = [];
    // gameBoard.forEach((move, index) => (move === 'X' ? xValues.push(index) : null));
    // const oValues = [];
    // gameBoard.forEach((move, index) => (move === 'O' ? oValues.push(index) : null));

    for (let i = 0; i < winningCombos.length; i++) {
      // this goes through every winning combo and checks
      // to see if every element is present
      winner = compareArray(xValues, winningCombos[i]) || compareArray(oValues, winningCombos[i]);
      if (winner) return true;
    }
  }
  return { checkForWinner, clickMove, getComputerChoice };
}());

const gameBoardModule = (function () {
  function _createBoard() {
    // create container and buttons
    const container = document.querySelector('.gameContainer');
    const btn1 = document.createElement('button');
    btn1.classList.add('gameBtn', 'btn1', 'top', 'left');
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
  function displayBoard() {
    _createBoard();
  }
  function updateDisplay(space, side) {
    document.querySelector(`.btn${space}`).textContent = side;
  }
  return { displayBoard, updateDisplay };
}());

gameBoardModule.displayBoard();

// This kicks things off when player hits a square (game button)
const gameBtns = document.querySelectorAll('.gameBtn');
gameBtns.forEach((button) => button.addEventListener('click', () => {
  // this line quits function if space is already taken
  if (button.textContent) return;
  gamePlayModule.clickMove(button);
}));
