/**#ES6 file to be converted into an ES5 file
    Our babel build/watch scripts in the package.json
    will convert this into ES5 and put it into the hosted folder.
**/
/**TODO
 * Add Scores To UI, display on right side of screen
 * Add Cheatsheet/rules to leftside of screen
 * fix layout of elements, it's kind of janky right now
 * Add bootstrap alerts/toasts when score is submitted/updated successfully
 * Stretch Goal, save the puzzles in a json file instead, write to that file
 * to save data between refreshes
 */

let paintColor;
let puzzleStart;
let puzzleState;
let puzzleSolution;
let currLevel = 1;
let currScore = 0;

//load the data for the current puzzle
const loadPuzzle = (level) => {

  fetch(`/puzzle?level=${level}`, {
    method: 'GET',
    headers: {
      "Accept": 'application/json'
    }
  }).then((response) => {
    if (response.status === 200) {
      response.json().then((data) => {
        setPuzzle(data);
      })
    }
    else {
      response.json().then((data) => {
        alert(`Error Message: ${data.message}. Error Code: ${data.id}`)
      })
    }
  }).catch((e) => {
    console.log("An error occured", e);
  })
}

//set the current puzzle
const setPuzzle = (puzzle) => {
  puzzleStart = puzzle.start;
  puzzleState = puzzle.start;
  puzzleSolution = puzzle.end;
  //loop through each cell for the solution and puzzle and set the correct class name
  for (let i = 1; i < 4; i++) {
    let col = 1;
    for (let cell of puzzle.start[i]) {
      document.querySelector(`#p${i}${col}`).className = cell;
      col++;
    }
    col = 1;
    for (let cell of puzzle.end[i]) {
      document.querySelector(`#s${i}${col}`).className = cell;
      col++;
    }
  }
  //set the class for the extra cell and set the paint color to it
  document.querySelector('#extra').className = puzzle.extra;
  setPaintColor(puzzle.extra);

}

//set the active paint color and update UI to match
const setPaintColor = (color) => {
  paintColor = color;
  document.querySelector('#active').className = color;
}

const colorCombinations = {
  //rgb
  redgreen: 'yellow',
  greenred: 'yellow',
  greenblue: 'cyan',
  bluegreen: 'cyan',
  bluered: 'magenta',
  redblue: 'magenta',
  //cym
  cyanmagenta: 'blue',
  magentacyan: 'blue',
  magentayellow: 'red',
  yellowmagenta: 'red',
  yellowcyan: 'green',
  cyanyellow: 'green',
  //color+white
  redwhite: 'red',
  greenwhite: 'green',
  bluewhite: 'blue',
  cyanwhite: 'cyan',
  magentawhite: 'magenta',
  yellowwhite: 'yellow',
  //lightcolor+white
  lightRedwhite: 'lightRed',
  lightGreenwhite: 'lightGreen',
  lightBluewhite: 'lightBlue',
  //darkcolor+white
  darkRedwhite: 'darkRed',
  lightGreenwhite: 'darkGreen',
  darkBluewhite: 'darkBlue',
  //white+color
  whitered: 'lightRed',
  whitegreen: 'lightGreen',
  whiteblue: 'lightBlue',
  //white+darkcolor
  whitedarkRed: 'red',
  whitedarkGreen: 'green',
  whitedarkBlue: 'blue',
  //black+color
  blackred: 'darkRed',
  blackgreen: 'darkGreen',
  blackblue: 'darkBlue',
  //black+lightcolor
  blacklightRed: 'red',
  blacklightGreen: 'green',
  blacklightBlue: 'blue',
  //rgb+cym
  redcyan: 'black',
  redyellow: 'black',
  redmagenta: 'black',
  greencyan: 'black',
  greenyellow: 'black',
  greenmagenta: 'black',
  bluecyan: 'black',
  blueyellow: 'black',
  bluemagenta: 'black',
  //cym+rgb
  cyanred: 'white',
  yellowred: 'white',
  magentared: 'white',
  cyangreen: 'white',
  yellowgreen: 'white',
  magentagreen: 'white',
  cyanblue: 'white',
  yellowblue: 'white',
  magentablue: 'white',
}

//change the color of the cell depending on the combination between its cell and the paint color
const handleCellChange = (cellId) => {
  const cell = document.querySelector(`#${cellId}`);
  const cellColor = cell.className;
  cell.className = colorCombinations[paintColor + cellColor] ? colorCombinations[paintColor + cellColor] : cell.className;
  //update puzzle state with new color
  const splitId = cellId.split("");
  puzzleState[splitId[1]][Number(splitId[2]) - 1] = cell.className;
  currScore++;
  //compare with solution to see if we finished the puzzle
  if (_.isEqual(puzzleState, puzzleSolution)) {
    //set the score in the modal and then reset it
    document.querySelector('#scoreForModal').innerHTML = `Score: ${currScore}`;
    //launch a modal for the user to sumbit their score
    $('#finishedModal').modal('show');
  }
}

//set the paint color currently in use
const handlePaintColorChange = (e, cellId) => {
  e.preventDefault();
  const cell = document.querySelector(`#${cellId}`);
  setPaintColor(cell.className);
}

//send post request to create/update score entry for this level
const submitScore = (e) => {
  //create the body for post request
  const jsonBody = {
    level: currLevel,
    score: currScore,
    name: document.querySelector('#playerName').value
  }

  fetch('/updatePuzzle', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(jsonBody),
  }).then((response) => {
    if (response.status === 201) {
      response.json().then(data => {
        console.log('Success:', data);
      }).catch((error) => {
        console.error('Error:', error);
      });
    }
    else if (response.status === 204) {
      console.log('Score updated');
    }
  }).catch((error) => {
    console.error('Error:', error);
  });
}

const init = () => {
  //add event listeners
  let cells = document.querySelectorAll("td");
  for (let cell of cells) {
    if (cell.id.includes('p')) {
      cell.addEventListener('click', () => handleCellChange(cell.id));
      cell.addEventListener('contextmenu', (e) => handlePaintColorChange(e, cell.id));
    }
    else if (cell.id === 'extra') {
      cell.addEventListener('contextmenu', (e) => handlePaintColorChange(e, cell.id));
    }
  }
  document.querySelector("#levelButton").addEventListener('click', (e) => loadPuzzle(currLevel));
  document.querySelector('#levelSelect').addEventListener('change', (e) => currLevel = e.target.value);
  document.querySelector('#submitButton').addEventListener('click', (e) => submitScore());
  //load the first puzzle
  loadPuzzle(currLevel);

};

window.onload = init;