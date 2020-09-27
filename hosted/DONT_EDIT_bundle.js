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
var paintColor;
var currPuzzleState;
var puzzleSolution; //load the data for the current puzzle

var loadPuzzle = function loadPuzzle(level) {
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

    console.log(response);
  })["catch"](function (e) {
    console.log("An error occured", e);
  });
};

var setPuzzle = function setPuzzle(puzzle) {
  console.log(puzzle); //loop through each cell for the solution and puzzle and set the correct class name

  for (var i = 1; i < 4; i++) {
    var col = 1;
    console.log(puzzle.start);

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
  }
};

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
}, _defineProperty(_colorCombinations, "lightGreenwhite", 'darkGreen'), _defineProperty(_colorCombinations, "darkBluewhite", 'darkBlue'), _defineProperty(_colorCombinations, "whitered", 'lightRed'), _defineProperty(_colorCombinations, "whitegreen", 'lightGreen'), _defineProperty(_colorCombinations, "whiteblue", 'lightBlue'), _defineProperty(_colorCombinations, "whitedarkRed", 'red'), _defineProperty(_colorCombinations, "whitedarkGreen", 'green'), _defineProperty(_colorCombinations, "whitedarkBlue", 'blue'), _defineProperty(_colorCombinations, "blackred", 'darkRed'), _defineProperty(_colorCombinations, "blackgreen", 'darkGreen'), _defineProperty(_colorCombinations, "blackblue", 'darkBlue'), _defineProperty(_colorCombinations, "blacklightRed", 'red'), _defineProperty(_colorCombinations, "blacklightGreen", 'green'), _defineProperty(_colorCombinations, "blacklightBlue", 'blue'), _defineProperty(_colorCombinations, "redcyan", 'black'), _defineProperty(_colorCombinations, "redyellow", 'black'), _defineProperty(_colorCombinations, "redmagenta", 'black'), _defineProperty(_colorCombinations, "greencyan", 'black'), _defineProperty(_colorCombinations, "greenyellow", 'black'), _defineProperty(_colorCombinations, "greenmagenta", 'black'), _defineProperty(_colorCombinations, "bluecyan", 'black'), _defineProperty(_colorCombinations, "blueyellow", 'black'), _defineProperty(_colorCombinations, "bluemagenta", 'black'), _defineProperty(_colorCombinations, "cyanred", 'white'), _defineProperty(_colorCombinations, "yellowred", 'white'), _defineProperty(_colorCombinations, "magentared", 'white'), _defineProperty(_colorCombinations, "cyangreen", 'white'), _defineProperty(_colorCombinations, "yellowgreen", 'white'), _defineProperty(_colorCombinations, "magentagreen", 'white'), _defineProperty(_colorCombinations, "cyanblue", 'white'), _defineProperty(_colorCombinations, "yellowblue", 'white'), _defineProperty(_colorCombinations, "magentablue", 'white'), _colorCombinations); //change the color of the cell depending on the combination between its cell and the paint color

var handleCellChange = function handleCellChange(cellId) {
  var cell = document.querySelector("#".concat(cellId));
  var cellColor = cell.className;
  cell.className = colorCombinations[paintColor + cellColor] ? colorCombinations[paintColor + cellColor] : cell.className;
}; //set the paint color currently in use


var handlePaintColorChange = function handlePaintColorChange(e, cellId) {
  e.preventDefault();
  var cell = document.querySelector("#".concat(cellId));
  paintColor = cell.className;
};

var init = function init() {
  //add event listeners
  var cells = document.querySelectorAll("td");

  var _iterator3 = _createForOfIteratorHelper(cells),
      _step3;

  try {
    var _loop = function _loop() {
      var cell = _step3.value;

      if (cell.id.includes('p')) {
        cell.addEventListener('click', function () {
          return handleCellChange(cell.id);
        });
        cell.addEventListener('contextmenu', function (e) {
          return handlePaintColorChange(e, cell.id);
        });
      }
    };

    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      _loop();
    } //load the first puzzle

  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }

  loadPuzzle(1);
};

window.onload = init;
