"use strict";

var _colorCombinations;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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
var paintColor;
var puzzleStart;
var puzzleState;
var puzzleSolution;
var currLevel = 1;
var currScore = 0;
var learnedRules;
var localStorage;
var lastTouchEnd = 0; //from https://stackoverflow.com/questions/16427636/check-if-localstorage-is-available

function storageAvailable(type) {
  try {
    var storage = window[type],
        x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return false;
  }
} //load the data for the current puzzle


var loadPuzzle = function loadPuzzle(level) {
  currScore = 0;
  fetch("/puzzle?level=".concat(level), {
    method: 'GET',
    headers: {
      "Accept": 'application/json'
    }
  }).then(function (response) {
    if (response.status === 200) {
      response.json().then(function (data) {
        setPuzzle(data);
      });
    } else {
      response.json().then(function (data) {
        alert("Error Message: ".concat(data.message, ". Error Code: ").concat(data.id));
      });
    }
  })["catch"](function (e) {
    console.log("An error occured", e);
  });
}; //set the current puzzle


var setPuzzle = function setPuzzle(puzzle) {
  puzzleStart = puzzle.start;
  puzzleState = puzzle.start;
  puzzleSolution = puzzle.end; //loop through each cell for the solution and puzzle and set the correct class name

  for (var i = 1; i < 4; i++) {
    var col = 1;

    var _iterator = _createForOfIteratorHelper(puzzle.start[i]),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var cell = _step.value;
        document.querySelector("#p".concat(i).concat(col)).className = cell;
        col++;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    col = 1;

    var _iterator2 = _createForOfIteratorHelper(puzzle.end[i]),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var _cell = _step2.value;
        document.querySelector("#s".concat(i).concat(col)).className = _cell;
        col++;
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  } //set the class for the extra cell and set the paint color to it


  document.querySelector('#extra').className = puzzle.extra;
  setPaintColor(puzzle.extra); //set the high scores if they exist

  if (!_.isEmpty(puzzle.scores)) {
    var scores = _.orderBy(puzzle.scores, ['score'], ['asc']);

    for (var _i = 0; _i < 3; _i++) {
      if (scores[_i]) {
        document.querySelector("#score".concat(_i + 1)).innerHTML = "".concat(_i + 1, ".) ").concat(scores[_i].name, " ").concat(scores[_i].score);
      } else {
        document.querySelector("#score".concat(_i + 1)).innerHTML = "".concat(_i + 1, ".)");
      }
    }
  } else {
    for (var _i2 = 0; _i2 < 3; _i2++) {
      document.querySelector("#score".concat(_i2 + 1)).innerHTML = "".concat(_i2 + 1, ".)");
    }
  }
}; //set the active paint color and update UI to match


var setPaintColor = function setPaintColor(color) {
  paintColor = color;
  document.querySelector('#active').className = color;
}; //all color combinations that can be used


var colorCombinations = (_colorCombinations = {
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
  darkRedwhite: 'darkRed'
}, _defineProperty(_colorCombinations, "lightGreenwhite", 'darkGreen'), _defineProperty(_colorCombinations, "darkBluewhite", 'darkBlue'), _defineProperty(_colorCombinations, "whitered", 'lightRed'), _defineProperty(_colorCombinations, "whitegreen", 'lightGreen'), _defineProperty(_colorCombinations, "whiteblue", 'lightBlue'), _defineProperty(_colorCombinations, "whitedarkRed", 'red'), _defineProperty(_colorCombinations, "whitedarkGreen", 'green'), _defineProperty(_colorCombinations, "whitedarkBlue", 'blue'), _defineProperty(_colorCombinations, "blackred", 'darkRed'), _defineProperty(_colorCombinations, "blackgreen", 'darkGreen'), _defineProperty(_colorCombinations, "blackblue", 'darkBlue'), _defineProperty(_colorCombinations, "blackwhite", 'black'), _defineProperty(_colorCombinations, "blacklightRed", 'red'), _defineProperty(_colorCombinations, "blacklightGreen", 'green'), _defineProperty(_colorCombinations, "blacklightBlue", 'blue'), _defineProperty(_colorCombinations, "redcyan", 'black'), _defineProperty(_colorCombinations, "redyellow", 'black'), _defineProperty(_colorCombinations, "redmagenta", 'black'), _defineProperty(_colorCombinations, "greencyan", 'black'), _defineProperty(_colorCombinations, "greenyellow", 'black'), _defineProperty(_colorCombinations, "greenmagenta", 'black'), _defineProperty(_colorCombinations, "bluecyan", 'black'), _defineProperty(_colorCombinations, "blueyellow", 'black'), _defineProperty(_colorCombinations, "bluemagenta", 'black'), _defineProperty(_colorCombinations, "cyanred", 'white'), _defineProperty(_colorCombinations, "yellowred", 'white'), _defineProperty(_colorCombinations, "magentared", 'white'), _defineProperty(_colorCombinations, "cyangreen", 'white'), _defineProperty(_colorCombinations, "yellowgreen", 'white'), _defineProperty(_colorCombinations, "magentagreen", 'white'), _defineProperty(_colorCombinations, "cyanblue", 'white'), _defineProperty(_colorCombinations, "yellowblue", 'white'), _defineProperty(_colorCombinations, "magentablue", 'white'), _colorCombinations); //change the color of the cell depending on the combination between its cell and the paint color

var handleCellChange = function handleCellChange(cellId) {
  var cell = document.querySelector("#".concat(cellId));
  var cellColor = cell.className;
  cell.className = colorCombinations[paintColor + cellColor] ? colorCombinations[paintColor + cellColor] : cell.className; //update puzzle state with new color

  var splitId = cellId.split("");
  puzzleState[splitId[1]][Number(splitId[2]) - 1] = cell.className;
  currScore++; //check to see if the player knows this rule yet, if not add it

  if (!learnedRules[paintColor + cellColor]) {
    addLearnedRule(paintColor, cellColor, cell.className);
  } //compare with solution to see if we finished the puzzle


  if (_.isEqual(puzzleState, puzzleSolution)) {
    //set the score in the modal and then reset it
    document.querySelector('#scoreForModal').innerHTML = "Score: ".concat(currScore); //launch a modal for the user to sumbit their score

    $('#finishedModal').modal('show');
  }
}; //set the paint color currently in use


var handlePaintColorChange = function handlePaintColorChange(e, cellId) {
  e.preventDefault();
  var cell = document.querySelector("#".concat(cellId));
  setPaintColor(cell.className);
}; //send post request to create/update score entry for this level


var submitScore = function submitScore(e) {
  var name = document.querySelector('#playerName').value;

  if (!name || !/^[a-zA-Z]+$/.test(name)) {
    console.log("invalid name");
    return;
  } //hide the modal


  $('#finishedModal').modal('hide'); //create the body for post request

  var jsonBody = {
    level: currLevel,
    score: currScore,
    name: name
  };
  fetch('/updatePuzzle', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(jsonBody)
  }).then(function (response) {
    //load the next level
    if (currLevel !== 5) {
      currLevel++;
    } else {
      currLevel = 1;
    }

    document.querySelector('#levelSelect').value = String(currLevel);
    loadPuzzle(currLevel);

    if (response.status === 201) {
      response.json().then(function (data) {
        console.log('Success:', data);
      })["catch"](function (error) {
        console.error('Error:', error);
      });
    } else if (response.status === 204) {
      console.log('Score updated');
    }
  })["catch"](function (error) {
    console.error('Error:', error);
  });
}; //add the learned rule and set local storage if possible


var addLearnedRule = function addLearnedRule(paintColor, cellColor, combination) {
  var id = paintColor + cellColor;
  var rule = "<span class=\"".concat(paintColor, "-underline\">").concat(_.startCase(paintColor), "</span> paint + \n    <span class=\"").concat(cellColor, "-underline\">").concat(_.startCase(cellColor), "</span> block = <span class=\"").concat(combination, "-underline\">").concat(_.startCase(combination), "</span>");
  learnedRules[id] = rule;
  displayLearnedRules();

  if (localStorage) {
    localStorage.setItem('learnedRules', JSON.stringify(learnedRules));
  }
}; //see if we can get the rules from local storage


var setLearnedRules = function setLearnedRules() {
  if (storageAvailable('localStorage')) {
    learnedRules = localStorage.getItem('learnedRules') ? JSON.parse(localStorage.getItem('learnedRules')) : {};

    if (learnedRules && Object.keys(learnedRules).length > 0) {
      displayLearnedRules();
    }
  } else {
    console.log('Please enable local storage to experience all features');
  }
}; //show rules this player has learned 


var displayLearnedRules = function displayLearnedRules() {
  //add the learned rules to the UI
  var target = document.querySelector('#learnedRules');
  var bigString = '';
  var keys = Object.keys(learnedRules);

  for (var _i3 = 0, _keys = keys; _i3 < _keys.length; _i3++) {
    var key = _keys[_i3];
    //class='${colorCombinations[key]}' not sure if I liked how it looked, removing for now
    bigString += "<li>".concat(learnedRules[key], "</li>");
  }

  target.innerHTML = bigString;
}; //https://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript


function is_touch_device() {
  try {
    document.createEvent("TouchEvent");
    return true;
  } catch (e) {
    return false;
  }
} //initalization 


var init = function init() {
  //add event listeners
  var cells = document.querySelectorAll("td"); //if we're on a touch screen device use hammer to create the touch events

  if (is_touch_device()) {
    //show the instructions for mobile and hide the desktop ones
    document.querySelector('#mobileInstructions').style.display = 'inherit';
    document.querySelector('#instructionsButton').style.display = 'none'; //prevent zoom https://stackoverflow.com/questions/37808180/disable-viewport-zooming-ios-10-safari

    document.addEventListener('touchend', function (event) {
      var now = new Date().getTime();

      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }

      lastTouchEnd = now;
    }, false);

    var _iterator3 = _createForOfIteratorHelper(cells),
        _step3;

    try {
      var _loop = function _loop() {
        var cell = _step3.value;

        if (cell.id.includes('p')) {
          //adapted from https://codepen.io/jtangelder/pen/pBuIw
          var hammerManager = new Hammer.Manager(cell); // Tap recognizer with minimal 2 taps

          hammerManager.add(new Hammer.Tap({
            event: 'doubletap',
            taps: 2
          })); // Single tap recognizer

          hammerManager.add(new Hammer.Tap({
            event: 'singletap'
          })); // we want to recognize this simulatenous, so a quadrupletap will be detected even while a tap has been recognized.

          hammerManager.get('doubletap').recognizeWith('singletap'); // we only want to trigger a tap, when we don't have detected a doubletap

          hammerManager.get('singletap').requireFailure('doubletap');
          hammerManager.on("singletap", function () {
            handleCellChange(cell.id);
          });
          hammerManager.on("doubletap", function (ev) {
            handlePaintColorChange(ev, cell.id);
          });
        } else if (cell.id === 'extra') {
          var _hammerManager = new Hammer.Manager(cell); // Tap recognizer with minimal 2 taps


          _hammerManager.add(new Hammer.Tap({
            event: 'doubletap',
            taps: 2
          })); // Single tap recognizer


          _hammerManager.add(new Hammer.Tap({
            event: 'singletap'
          })); // we want to recognize this simulatenous, so a quadrupletap will be detected even while a tap has been recognized.


          _hammerManager.get('doubletap').recognizeWith('singletap'); // we only want to trigger a tap, when we don't have detected a doubletap


          _hammerManager.get('singletap').requireFailure('doubletap');

          _hammerManager.on("singletap", function () {
            return;
          });

          _hammerManager.on("doubletap", function (ev) {
            handlePaintColorChange(ev, cell.id);
          });
        }
      };

      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        _loop();
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
  } //not a touch device, use normal events
  else {
      var _iterator4 = _createForOfIteratorHelper(cells),
          _step4;

      try {
        var _loop2 = function _loop2() {
          var cell = _step4.value;

          if (cell.id.includes('p')) {
            cell.addEventListener('click', function () {
              return handleCellChange(cell.id);
            });
            cell.addEventListener('contextmenu', function (e) {
              return handlePaintColorChange(e, cell.id);
            });
          } else if (cell.id === 'extra') {
            cell.addEventListener('contextmenu', function (e) {
              return handlePaintColorChange(e, cell.id);
            });
          }
        };

        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          _loop2();
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }

  document.querySelector("#levelButton").addEventListener('click', function (e) {
    return loadPuzzle(currLevel);
  });
  document.querySelector('#levelSelect').addEventListener('change', function (e) {
    currLevel = e.target.value;
    loadPuzzle(currLevel);
  });
  document.querySelector('#submitButton').addEventListener('click', function (e) {
    return submitScore();
  }); //enable popovers

  $(function () {
    $('[data-toggle="popover"]').popover({
      trigger: 'focus'
    });
  }); //reset score after submitting score

  $('#finishedModal').on('hidden.bs.modal', function (e) {
    currScore = 0;
  }); //load the first puzzle

  loadPuzzle(currLevel);
  setLearnedRules();
};

window.onload = init;
