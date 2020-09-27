/**#ES6 file to be converted into an ES5 file
    Our babel build/watch scripts in the package.json
    will convert this into ES5 and put it into the hosted folder.
**/

let paintColor;
let currPuzzleState;
let puzzleSolution;

//load the data for the current puzzle
const loadPuzzle = (level) => {

  fetch(`/puzzle?level=${level}`, {
    method: 'GET',
    headers: {
      "Accept": 'application/json'
    }
  }).then((response) => {
    if(response.status === 200){
      response.json().then((data) => {
        setPuzzle(data);
      })
    }
    else{
      response.json().then((data) => {
        alert(`Error Message: ${data.message}. Error Code: ${data.id}`)
      })
    }
    console.log(response);
  }).catch((e) => {
    console.log("An error occured", e);
  })
}

const setPuzzle = (puzzle) => {
  console.log(puzzle);
  //loop through each cell for the solution and puzzle and set the correct class name
  for(let i = 1; i < 4; i++){
    let col = 1;
    console.log(puzzle.start);
    for(let cell of puzzle.start[i]){
      document.querySelector(`#p${i}${col}`).className = cell;
      col++;
    }
    col = 1;
    for(let cell of puzzle.end[i]){
      document.querySelector(`#s${i}${col}`).className = cell;
      col++;
    }
  }
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
}

//set the paint color currently in use
const handlePaintColorChange = (e, cellId) => {
  e.preventDefault();
  const cell = document.querySelector(`#${cellId}`);
  paintColor = cell.className;
}

const init = () => {
  //add event listeners
  let cells = document.querySelectorAll("td");
  for (let cell of cells) {
    if (cell.id.includes('p')) {
      cell.addEventListener('click', () => handleCellChange(cell.id));
      cell.addEventListener('contextmenu', (e) => handlePaintColorChange(e, cell.id));
    }
  }
  //load the first puzzle
  loadPuzzle(1);

};

window.onload = init;