/**#ES6 file to be converted into an ES5 file
    Our babel build/watch scripts in the package.json
    will convert this into ES5 and put it into the hosted folder.
**/
/**TODO
 * Add Scores To UI, display on right side of screen
 * Add rules/how to play 
 * fix layout of elements, it's kind of janky right now
 * Add bootstrap alerts/toasts when score is submitted/updated successfully
 */

let paintColor;
let puzzleStart;
let puzzleState;
let puzzleSolution;
let currLevel = 1;
let currScore = 0;
let learnedRules;
let localStorage;

//from https://stackoverflow.com/questions/16427636/check-if-localstorage-is-available
function storageAvailable(type) {
  try {
    let storage = window[type],
      x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  }
  catch (e) {
    return false;
  }
}

//load the data for the current puzzle
const loadPuzzle = (level) => {
  currScore = 0;
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
  //set the high scores if they exist
  if (!_.isEmpty(puzzle.scores)) {
    const scores = _.orderBy(puzzle.scores, ['score'], ['asc']);
    for (let i = 0; i < 3; i++) {
      if (scores[i]) {
        document.querySelector(`#score${i + 1}`).innerHTML = `${i + 1}.) ${scores[i].name} ${scores[i].score}`;
      }
      else {
        document.querySelector(`#score${i + 1}`).innerHTML = `${i + 1}.)`;
      }
    }
  } else {
    for (let i = 0; i < 3; i++) {
      document.querySelector(`#score${i + 1}`).innerHTML = `${i + 1}.)`;
    }
  }

}

//set the active paint color and update UI to match
const setPaintColor = (color) => {
  paintColor = color;
  document.querySelector('#active').className = color;
}

//all color combinations that can be used
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
  blackwhite: 'black',
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
  //check to see if the player knows this rule yet, if not add it
  if (!learnedRules[paintColor + cellColor]) {
    addLearnedRule(paintColor, cellColor, cell.className);
  }
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
  let name = document.querySelector('#playerName').value;
  if (!name || !/^[a-zA-Z]+$/.test(name)) {
    console.log("invalid name");
    return;
  }
  //hide the modal
  $('#finishedModal').modal('hide');
  //create the body for post request
  const jsonBody = {
    level: currLevel,
    score: currScore,
    name: name
  }

  fetch('/updatePuzzle', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(jsonBody),
  }).then((response) => {
    //load the next level
    if (currLevel !== 5) {
      currLevel++;
    }
    else {
      currLevel = 1;
    }
    document.querySelector('#levelSelect').value = String(currLevel);
    loadPuzzle(currLevel);
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

//add the learned rule and set local storage if possible
const addLearnedRule = (paintColor, cellColor, combination) => {
  const id = paintColor + cellColor;
  const rule = `<span class="${paintColor}-underline">${_.startCase(paintColor)}</span> paint + 
    <span class="${cellColor}-underline">${_.startCase(cellColor)}</span> block = <span class="${combination}-underline">${_.startCase(combination)}</span>`
  learnedRules[id] = rule;
  displayLearnedRules();
  if (localStorage) {
    localStorage.setItem('learnedRules', JSON.stringify(learnedRules));
  }
}

//see if we can get the rules from local storage
const setLearnedRules = () => {
  if (storageAvailable('localStorage')) {
    learnedRules = localStorage.getItem('learnedRules') ? JSON.parse(localStorage.getItem('learnedRules')) : {};
    if (learnedRules && Object.keys(learnedRules).length > 0) {
      displayLearnedRules()
    }
  }
  else {
    console.log('Please enable local storage to experience all features');
  }
}

//show rules this player has learned 
const displayLearnedRules = () => {
  //add the learned rules to the UI
  const target = document.querySelector('#learnedRules');
  let bigString = ''
  let keys = Object.keys(learnedRules);
  for (let key of keys) {
    //class='${colorCombinations[key]}' not sure if I liked how it looked, removing for now
    bigString += `<li>${learnedRules[key]}</li>`
  }
  target.innerHTML = bigString;
}

//https://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
function is_touch_device() {
  try {
    document.createEvent("TouchEvent");
    return true;
  } catch (e) {
    return false;
  }
}

//initalization 
const init = () => {
  //add event listeners
  let cells = document.querySelectorAll("td");
  //if we're on a touch screen device use hammer to create the touch events
  if (is_touch_device()) {
    for (let cell of cells) {
      if (cell.id.includes('p')) {
        //adapted from https://codepen.io/jtangelder/pen/pBuIw
        let hammerManager = new Hammer.Manager(cell);
        // Tap recognizer with minimal 2 taps
        hammerManager.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));
        // Single tap recognizer
        hammerManager.add(new Hammer.Tap({ event: 'singletap' }));

        // we want to recognize this simulatenous, so a quadrupletap will be detected even while a tap has been recognized.
        hammerManager.get('doubletap').recognizeWith('singletap');
        // we only want to trigger a tap, when we don't have detected a doubletap
        hammerManager.get('singletap').requireFailure('doubletap');

        hammerManager.on("singletap", function () {
          handleCellChange(cell.id);
        });
        hammerManager.on("doubletap", function (ev) {
          ev.preventDefault();
          handlePaintColorChange(ev, cell.id)
        });
      }
      else if (cell.id === 'extra') {
        let hammerManager = new Hammer.Manager(cell);
        // Tap recognizer with minimal 2 taps
        hammerManager.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));
        // Single tap recognizer
        hammerManager.add(new Hammer.Tap({ event: 'singletap' }));

        // we want to recognize this simulatenous, so a quadrupletap will be detected even while a tap has been recognized.
        hammerManager.get('doubletap').recognizeWith('singletap');
        // we only want to trigger a tap, when we don't have detected a doubletap
        hammerManager.get('singletap').requireFailure('doubletap');

        hammerManager.on("singletap", function () {
         return;
        });
        hammerManager.on("doubletap", function (ev) {
          ev.preventDefault();
          handlePaintColorChange(ev, cell.id)
        });
      }
    }
  }
  //not a touch device, use normal events
  else {
    for (let cell of cells) {
      if (cell.id.includes('p')) {
        cell.addEventListener('click', () => handleCellChange(cell.id));
        cell.addEventListener('contextmenu', (e) => handlePaintColorChange(e, cell.id));
      }
      else if (cell.id === 'extra') {
        cell.addEventListener('contextmenu', (e) => handlePaintColorChange(e, cell.id));
      }
    }
  }
  document.querySelector("#levelButton").addEventListener('click', (e) => loadPuzzle(currLevel));
  document.querySelector('#levelSelect').addEventListener('change', (e) => {
    currLevel = e.target.value;
    loadPuzzle(currLevel);
  });
  document.querySelector('#submitButton').addEventListener('click', (e) => submitScore());
  //enable popovers
  $(function () {
    $('[data-toggle="popover"]').popover({
      trigger: 'focus'
    })
  });
  //reset score after submitting score
  $('#finishedModal').on('hidden.bs.modal', function (e) {
    currScore = 0;
  });
  //load the first puzzle
  loadPuzzle(currLevel);
  setLearnedRules();


};

window.onload = init