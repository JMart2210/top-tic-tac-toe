/* eslint-disable no-underscore-dangle */

const Player = (name, mark) => ({ name, mark });

const gamePlayModule = (function () {
  let gameBoard = ['0', '', '', '', '', '', '', '', '', ''];
  let xValues = [];
  let oValues = [];
  const playerOne = Player('Player One', 'X');
  const playerTwo = Player('Player Two', 'O');
  let winner = false;
  let turnNumber = 0;
  let turn = playerOne;
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

  function switchMark() {
    clearBoard();
    [playerOne.mark, playerTwo.mark] = [playerTwo.mark, playerOne.mark];
  }

  function compareArray(testArray, ansArray) {
    if (ansArray.every((el) => testArray.includes(el))) {
      return ansArray;
    }
  }

  function gameOver(winningMark) {
    DomElement.gameOverMsg.classList.add('visible');
    document.querySelector(`.btn${winner[0]}`).classList.add('winning');
    document.querySelector(`.btn${winner[1]}`).classList.add('winning');
    document.querySelector(`.btn${winner[2]}`).classList.add('winning');
  }

  function nextTurn() {
    turn = (turn == playerOne) ? playerTwo : playerOne;
    turnNumber += 1;
  }

  function clickAction(space) {
    const move = space.dataset.id;
    updateGameBoard(move, turn.mark);
    if (checkForWinner()) return gameOver(turn.mark);
    nextTurn();
    if (playerTwo.name === 'cpu') {
      updateGameBoard(getComputerChoice(), turn.mark);
      if (checkForWinner()) gameOver(turn.mark);
      nextTurn();
    }
    //   }
    //   if (turnNumber > 8) return;
    //   updateGameBoard(getComputerChoice(), 'O');
    //   if (checkForWinner()) gameOver('O');
    // }
  }

  // this updates the game board array as well as the
  // arrays that keep track of the moves for each side
  function updateGameBoard(move, mark) {
    gameBoard[move] = mark;
    if (mark === 'X') xValues.push(+move);
    else {
      oValues.push(+move);
    }
    gameBoardModule.updateDisplay(move, mark);
  }

  function getWinningCombos(movesSoFar) {
    let winningCombosLeft = [...winningCombos];
    for (let j = 0; j < movesSoFar.length; j++) {
      for (let i = winningCombosLeft.length-1; i >= 0; i--) {
      // this creates an object where the key is the move option,
      // and the value is how many times it was present in the winning combos
        if (movesSoFar[j] === winningCombosLeft[i][0] || 
          movesSoFar[j] === winningCombosLeft[i][1] || 
          movesSoFar[j] === winningCombosLeft[i][2]) {
          winningCombosLeft.splice(i, 1);
        }
      }
    }
    console.table(winningCombosLeft);
    return winningCombosLeft;
  }

  function getComputerChoice() {
    const Board = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let moveOptions = {};
    let openSquares = Board;
    let theLosingMove = null; // you will lose if your opponent were to play this move
    let opponentWinningMoves = [];
    let yourWinningMoves = {};
    let tempArrayW = [];
    let tempArrayL = [];
    openSquares = openSquares.filter((val) => !oValues.includes(val));
    openSquares = openSquares.filter((val) => !xValues.includes(val));

    // function loops through the possible open moves, and
    // returns if 1)you have a winning move, 2) your opponent
    // has a "losing" move (so you can block it), or 3) the next
    // best move based on the how useful the moves appear to be.
    for (i = 0; i < winningCombos.length; i++) {
      for (j = 0; j < openSquares.length; j++) {
        if (turn.mark === 'X') {
          tempArrayW = [...xValues];
          tempArrayL = [...oValues];
        } else {
          tempArrayW = [...oValues];
          tempArrayL = [...xValues];
        }
        tempArrayW.push(openSquares[j]);
        tempArrayL.push(openSquares[j]);
        if (compareArray(tempArrayW, winningCombos[i])) {
          let theWinningMove = tempArrayW[tempArrayW.length - 1];
          console.log(`Winning Move: ${theWinningMove}`);
          return theWinningMove;
        }
        if (compareArray(tempArrayL, winningCombos[i])) {
          theLosingMove = tempArrayL[tempArrayL.length - 1];
          console.log(`Losing Move: ${theLosingMove}`);
        }
      }
    }
    // I had to return the losing move outside of the loop because
    // there were some cases where there was a winning move AND a "losing"
    // move. The loop would find the losing move first, which caused
    // the cpu to prevent the loss, instead of just making the winning move.
    if (theLosingMove) return theLosingMove;

    if (turn.mark === 'X') {
      opponentWinningMoves = getWinningCombos(xValues);
      yourWinningMoves = getWinningCombos(oValues);
    } else {
      opponentWinningMoves = getWinningCombos(oValues);
      yourWinningMoves = getWinningCombos(xValues);
    }
    for (let i = 0; i < winningCombos.length; i++) {
      for (let j = 0; j < openSquares.length; j++) {
      // this loop creates an object that tells you which available space has the most
      // appearances in the opponent's winning combos (aka which ones would be good to block)
        if (openSquares[j] === winningCombos[i][0]) {
          moveOptions[winningCombos[i][0]] = 
          (moveOptions[winningCombos[i][0]] + 1) || 1;
        }
        if (openSquares[j] === winningCombos[i][1]) {
          moveOptions[winningCombos[i][1]] = 
          (moveOptions[winningCombos[i][1]] + 1) || 1;
        }
        if (openSquares[j] === winningCombos[i][2]) {
          moveOptions[winningCombos[i][2]] = 
          (moveOptions[winningCombos[i][2]] + 1) || 1;
        }
      }
    }
    // this one does better on move 3 -only adds 1
    for (let i = 0; i < winningCombos.length; i++) {
      for (let j = 0; j < openSquares.length; j++) {
      // this loop adds to the same object above and tells you which available space has the most
      // appearances in your winning combos (aka good to try and win)
        if (openSquares[j] === winningCombos[i][0]) {
          moveOptions[winningCombos[i][0]] = (moveOptions[winningCombos[i][0]] + 1) || 1;
        }
        if (openSquares[j] === winningCombos[i][1]) {
          moveOptions[winningCombos[i][1]] = (moveOptions[winningCombos[i][1]] + 1) || 1;
        }
        if (openSquares[j] === winningCombos[i][2]) {
          moveOptions[winningCombos[i][2]] = (moveOptions[winningCombos[i][2]] + 1) || 1;
        }
      }
    }

    console.table(moveOptions);
    moveOptions = Object.entries(moveOptions).sort((a,b) => b[1]-a[1]).map(el=>el[0]).slice(0,1);
    return moveOptions;
  }
  function checkForWinner() {
    for (let i = 0; i < winningCombos.length; i++) {
      // this goes through every winning combo and checks
      // to see if every element is present
      winner = compareArray(xValues, winningCombos[i]) || compareArray(oValues, winningCombos[i]);
      if (winner) return true;
      if (turnNumber === 9) {
        DomElement.gameOverMsg.textContent = "It's a draw!";
      }
    }
  }
  function clearBoard() {
    gameBoard = ['0', '', '', '', '', '', '', '', '', ''];
    xValues = [];
    oValues = [];
    winner = false;
    turnNumber = 0;
    turn = playerOne;
    DomElement.gameBtns.forEach((button) => {
      button.textContent = '';
      button.classList.remove('winning');
    });
    DomElement.gameOverMsg.classList.remove('visible');
  }
  function cpuToggle() {
    clearBoard();
    if (playerTwo.name == 'cpu') {
      playerTwo.name = 'Player Two';
      DomElement.aiPlayerBtn.textContent = 'Play against CPU';
    } else {
      playerTwo.name = 'cpu';
      DomElement.aiPlayerBtn.textContent = 'Two Players';
    }
  }
  return {
    clickAction,
    switchMark,
    cpuToggle,
    clearBoard
  };
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
  function updateDisplay(space, mark) {
    document.querySelector(`.btn${space}`).textContent = mark;
  }
  return { displayBoard, updateDisplay };
}());

gameBoardModule.displayBoard();
const DomElement = (function () {
  const twoPlayerBtn = document.querySelector('.twoPlayer');
  const aiPlayerBtn = document.querySelector('.aiPlayer');
  const restartBtn = document.querySelector('.restart');
  const gameBtns = document.querySelectorAll('.gameBtn');
  const gameOverMsg = document.querySelector('.gameOverMsg');

  return {
    twoPlayerBtn,
    aiPlayerBtn,
    restartBtn,
    gameBtns,
    gameOverMsg,
  };
}());

DomElement.gameBtns.forEach((button) => button.addEventListener('click', () => {
  // this line quits function if space is already taken
  if (button.textContent) return;
  gamePlayModule.clickAction(button);
}));

DomElement.restartBtn.addEventListener('click', gamePlayModule.clearBoard);

DomElement.aiPlayerBtn.addEventListener('click', () => {
  gamePlayModule.cpuToggle();
});
