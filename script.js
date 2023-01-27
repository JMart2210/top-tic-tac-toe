/* eslint-disable no-underscore-dangle */
const gameBoardModule = (function () {
  function _createBoard() {
    // create container and buttons
    const container = document.querySelector('.gameContainer');
    const btn1 = document.createElement('button');
    const btn2 = document.createElement('button');
    const btn3 = document.createElement('button');
    const btn4 = document.createElement('button');
    const btn5 = document.createElement('button');
    const btn6 = document.createElement('button');
    const btn7 = document.createElement('button');
    const btn8 = document.createElement('button');
    const btn9 = document.createElement('button');
    // create rows
    const row1 = document.createElement('div');
    const row2 = document.createElement('div');
    const row3 = document.createElement('div');
    // append rows & buttons
    container.append(row1, row2, row3);
    row1.append(btn1, btn2, btn3);
    row2.append(btn4, btn5, btn6);
    row3.append(btn7, btn8, btn9);
  }
  function getBoard() {
    _createBoard();
  }
  return { getBoard };
}());
