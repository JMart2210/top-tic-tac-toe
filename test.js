const winningCombos = [
  [1, 2, 3],
  [1, 4, 7],
  [1, 5, 9],
  [2, 5, 8],
  [3, 5, 7],
  [3, 6, 9],
  [4, 5, 6],
  [7, 8, 9]];
const Board = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const moveOptions = {};
let tempArray = [];

function compareArray(testArray, ansArray) {
  if (ansArray.every((el) => testArray.includes(el))) return testArray;
}

function aiMove() {
  let openSquares = Board.filter(val => !xValues.includes(val));
  openSquares = openSquares.filter(val => !oValues.includes(val));
  console.log(openSquares);
  for (let i = 0; i < winningCombos.length; i++) {
    for (let j =0; j < openSquares.length; j++) {
      // this creates an object where the key is the move option, and the value is how many times it was present in the winning combos
      if (openSquares[j] == winningCombos[i][0]) moveOptions[winningCombos[i][0]] = (moveOptions[winningCombos[i][0]]+1) || 1;
      if (openSquares[j] == winningCombos[i][1]) moveOptions[winningCombos[i][1]] = (moveOptions[winningCombos[i][1]]+1) || 1;
      if (openSquares[j] == winningCombos[i][2]) moveOptions[winningCombos[i][2]] = (moveOptions[winningCombos[i][2]]+1) || 1;
      console.log(moveOptions);
    }
  }
  for (i = 0; i < winningCombos.length; i++) {
    for (j = 0; j < openSquares.length; j++) {
      tempArrayW = [...xValues];
      tempArrayW.push(openSquares[j]);
      tempArrayL = [...oValues];
      tempArrayL.push(openSquares[j]);
      if (compareArray(tempArrayW, winningCombos[i])) {
        theWinningMove = tempArrayW[tempArrayW.length-1];
        console.log('The Winning Move:' + theWinningMove);
        return theWinningMove;
      }
      if (compareArray(tempArrayL, winningCombos[i])) {
        theLosingMove = tempArrayL[tempArrayL.length-1];
        console.log('The Losing Move:' + theLosingMove);
        return theLosingMove;
      }
    }
  }
}
aiMove();

if (turnNumber === 3) {
  return openSquares[Math.floor(Math.random() * openSquares.length)];
}