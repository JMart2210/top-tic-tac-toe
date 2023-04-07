const Player = (name, mark) => {
  const moves = [];
  return { name, mark, moves };
};

const gamePlayModule = (function () {
  let gameBoard = ['0', '', '', '', '', '', '', '', '', ''];
  let playerOne = Player('The Hero', 'X');
  let playerTwo = Player('Player Two', 'O');
  let winner = false;
  let turnNumber = 0;
  let turn = playerOne;
  let otherTurn = playerTwo;
  let cpuChoice = null;
  const winningCombos = [
    [1, 2, 3],
    [1, 4, 7],
    [1, 5, 9],
    [2, 5, 8],
    [3, 5, 7],
    [3, 6, 9],
    [4, 5, 6],
    [7, 8, 9]];

  // This was the start of allowing user to decide X's or O's.
  // but I never implemented that option.
  function switchMark() {
    DomElement.switchSideBtn.textContent = `Play for the ${playerOne.mark}'s`;
    [playerOne.mark, playerTwo.mark] = [playerTwo.mark, playerOne.mark];
    clearBoard();    
  }

  // compares an array with players moves to an array with winning
  // moves. If present, returns the winning array.
  function compareArray(testArray, ansArray) {
    if (ansArray.every((el) => testArray.includes(el))) {
      return ansArray;
    }
  }

  // Updates display to congratulate winner, or signify a tie
  function gameOver(winner) {
    DomElement.gameBtns.forEach((button) => {
      button.disabled = true;
    });
    DomElement.gameOverContainer.classList.add('visible');
    DomElement.mainDisplay.classList.add('blur');
    if (winner == 'Draw') {
      DomElement.gameOverMsg.textContent = "It's a draw!";
      return;
    }
    DomElement.gameOverMsg.textContent = `${turn.name} wins!`;
    // Winning class highlights the winning selections
    document.querySelector(`.btn${winner[0]}`).classList.add('winning');
    document.querySelector(`.btn${winner[1]}`).classList.add('winning');
    document.querySelector(`.btn${winner[2]}`).classList.add('winning');
  }

  //swaps who's turn it is and increments turn number.
  function nextTurn() {
    [turn, otherTurn] = [otherTurn, turn];
    turnNumber += 1;
    if (turn.name === 'cpu') {
      computerMove();
    }
  }

  // receives move, updates game board and checks if they are a winner
  function clickAction(space) {
    const move = space.dataset.id;
    updateGameBoard(move, turn.mark);
    if (checkForWinner()) return gameOver(winner);
    nextTurn();
    // we want to automatically get next move if the 
    // game is not over and Player two is a cpu.
  }

  // this updates the game board array as well as the
  // player moves for each side
  function updateGameBoard(move, mark) {
    gameBoard[move] = mark;
    turn.moves.push(+move);
    gameBoardModule.updateDisplay(move, mark);
  }

  // If a move played so far by the opponent matches a move needed
  // in the winning combo, then that combo is removed. An array with 
  // the remaining winning combos is returned.
  function getWinningCombos(movesSoFar) {
    const winningCombosLeft = [...winningCombos];
    for (let j = 0; j < movesSoFar.length; j++) {
      for (let i = winningCombosLeft.length - 1; i >= 0; i--) {
        if (movesSoFar[j] === winningCombosLeft[i][0]
          || movesSoFar[j] === winningCombosLeft[i][1]
          || movesSoFar[j] === winningCombosLeft[i][2]) {
          winningCombosLeft.splice(i, 1);
        }
      }
    }
    return winningCombosLeft;
  }

  // This returns where computer should play. It loops through the
  // possible open moves, and returns if 1)you have a winning move,
  // 2) your opponent has a "losing" move (so you can block it), or
  // 3) the next best move based on the how useful it appears to be.
  function getComputerChoice() {
    const Board = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let moveOptions = {};
    let openSquares = Board;
    let theLosingMove = null; // you will lose if your opponent were to play this move
    let opponentWinningMoves = [];
    let yourWinningMoves = {};
    let tempArrayW = [];
    let tempArrayL = [];
    openSquares = openSquares.filter((val) => !playerTwo.moves.includes(val));
    openSquares = openSquares.filter((val) => !playerOne.moves.includes(val));

    for (i = 0; i < winningCombos.length; i++) {
      for (j = 0; j < openSquares.length; j++) {
        if (turn === playerOne) {
          tempArrayW = [...playerOne.moves];
          tempArrayL = [...playerTwo.moves];
        } else {
          tempArrayW = [...playerTwo.moves];
          tempArrayL = [...playerOne.moves];
        }
        tempArrayW.push(openSquares[j]);
        tempArrayL.push(openSquares[j]);
        if (compareArray(tempArrayW, winningCombos[i])) {
          const theWinningMove = tempArrayW[tempArrayW.length - 1];
          return theWinningMove;
        }
        if (compareArray(tempArrayL, winningCombos[i])) {
          theLosingMove = tempArrayL[tempArrayL.length - 1];
        }
      }
    }
    // I had to return the losing move outside of the loop because
    // there were some cases where there was a winning move AND a "losing"
    // move. The loop would find the losing move first, which caused
    // the cpu to prevent the loss, instead of just making the winning move.
    if (theLosingMove) return theLosingMove;

    // I could have simplified this now, since the turn variable is
    // tied to the player, and it switches with every turn, but it works as-is,
    // and it's fun to remember how I got things working.
    if (turn === playerOne) {
      opponentWinningMoves = getWinningCombos(playerOne.moves);
    } else {
      opponentWinningMoves = getWinningCombos(playerTwo.moves);
    }
    
    // this loop creates an object that tells you which available space has the most
    // appearances in the opponent's winning combos (aka which ones would be good to block)
    for (let i = 0; i < opponentWinningMoves.length; i++) {
      for (let j = 0; j < openSquares.length; j++) {
        if (openSquares[j] === opponentWinningMoves[i][0]) {
          moveOptions[opponentWinningMoves[i][0]] = (moveOptions[opponentWinningMoves[i][0]] + 1) || 1;
        }
        if (openSquares[j] === opponentWinningMoves[i][1]) {
          moveOptions[opponentWinningMoves[i][1]] = (moveOptions[opponentWinningMoves[i][1]] + 1) || 1;
        }
        if (openSquares[j] === opponentWinningMoves[i][2]) {
          moveOptions[opponentWinningMoves[i][2]] = (moveOptions[opponentWinningMoves[i][2]] + 1) || 1;
        }
      }
    }

    // this loop adds to the same object above and tells you which available space
    // has the most appearances in your winning combos (aka good to try and win)
    for (let i = 0; i < winningCombos.length; i++) {
      for (let j = 0; j < openSquares.length; j++) {
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
    moveOptions = Object.entries(moveOptions).sort((a, b) => b[1] - a[1]).map((el) => el[0]).slice(0, 1);
   
    // cpuHelp function will only apply if no winning or losing
    // move was found above.
    moveOptions = cpuHelper(moveOptions);
    return moveOptions;
  }

  // instead of re-doing all of the cpu logic to figure out
  // the failure at move 3, I just made a helper function
  // that stops the blunder. Seems to work.
  function cpuHelper(move) {
    let help = move;
    if (turnNumber != 3) return help;
    if ((otherTurn.moves.includes(1) || otherTurn.moves.includes(3))
      && (otherTurn.moves.includes(8) || otherTurn.moves.includes(9))) help = 4;
    if ((otherTurn.moves.includes(7) || otherTurn.moves.includes(1))
      && (otherTurn.moves.includes(6) || otherTurn.moves.includes(3))) help = 8;
    return help;
  }

  function checkForWinner() {
    for (let i = 0; i < winningCombos.length; i++) {
      // this goes through every winning combo and checks
      // to see if every element is present
      winner = compareArray(turn.moves, winningCombos[i]);      
      if (winner) return winner;
    }
    if (turnNumber === 8) {
      winner = 'Draw';
      return winner;
    }
  }

  function computerMove() {
    cpuChoice = getComputerChoice();
    updateGameBoard(cpuChoice, turn.mark);
    if (checkForWinner()) gameOver(winner);
    nextTurn();
  }

  // Resets gameboard and all pertinent fields
  function clearBoard() {
    gameBoard = ['0', '', '', '', '', '', '', '', '', ''];
    playerOne.moves = [];
    playerTwo.moves = [];
    winner = false;
    turnNumber = 0;
    DomElement.gameBtns.forEach((button) => {
      button.textContent = '';
      button.classList.remove('winning');
      button.disabled = false;
    });
    DomElement.gameOverContainer.classList.remove('visible');
    DomElement.mainDisplay.classList.remove('blur');
    if (playerOne.mark === 'X') {
      turn = playerOne;
      otherTurn = playerTwo;
    } else {
      turn = playerTwo;
      otherTurn = playerOne;
      
      if (turn.name === 'cpu') computerMove();
    }
  }

  // updates playerTwo to cpu.
  function cpuToggle() {
    if (playerTwo.name == 'cpu') {
      playerTwo.name = 'Player Two';
      DomElement.aiPlayerBtn.textContent = 'Play against CPU';
    } else {
      playerTwo.name = 'cpu';
      DomElement.aiPlayerBtn.textContent = 'Two Players';
    }
    clearBoard();
  }
  return {
    clickAction,
    switchMark,
    cpuToggle,
    clearBoard,
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
  const restartBtns = document.querySelectorAll('.restart');
  const gameBtns = document.querySelectorAll('.gameBtn');
  const gameOverContainer = document.querySelector('.gameOverContainer');
  const gameOverMsg = document.querySelector('.gameOverMsg');
  const mainDisplay = document.querySelector('.main');
  const switchSideBtn = document.querySelector('.switch');

  return {
    twoPlayerBtn,
    aiPlayerBtn,
    restartBtns,
    gameBtns,
    gameOverContainer,
    gameOverMsg,
    mainDisplay,
    switchSideBtn,
  };
}());

DomElement.gameBtns.forEach((button) => button.addEventListener('click', () => {
  // this line quits function if space is already taken
  if (button.textContent) return;
  gamePlayModule.clickAction(button);
}));

DomElement.restartBtns.forEach((button) => button.addEventListener('click', () => {
  gamePlayModule.clearBoard();  
}));

DomElement.aiPlayerBtn.addEventListener('click', () => {
  gamePlayModule.cpuToggle();
});

DomElement.switchSideBtn.addEventListener('click', () => {
  gamePlayModule.switchMark();
});
