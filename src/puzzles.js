// this contains all of the info about the puzzles,
// would ideally not be stored in memory but will have to work for now
const puzzles = {
  1: {
    start: {
      1: ['white', 'white', 'white'],
      2: ['white', 'red', 'white'],
      3: ['white', 'white', 'white'],
    },
    end: {
      1: ['yellow', 'white', 'yellow'],
      2: ['white', 'red', 'white'],
      3: ['yellow', 'white', 'yellow'],
    },
    extra: 'green',
    completed: false,
    scores: {},
  },
  2: {
    start: {
      1: ['white', 'white', 'green'],
      2: ['white', 'red', 'white'],
      3: ['white', 'white', 'white'],
    },
    end: {
      1: ['yellow', 'cyan', 'green'],
      2: ['magenta', 'red', 'magenta'],
      3: ['blue', 'cyan', 'yellow'],
    },
    extra: 'blue',
    completed: false,
    scores: {},
  },
  3: {
    start: {
      1: ['white', 'cyan', 'green'],
      2: ['white', 'magenta', 'white'],
      3: ['white', 'white', 'white'],
    },
    end: {
      1: ['red', 'green', 'green'],
      2: ['red', 'cyan', 'cyan'],
      3: ['red', 'yellow', 'yellow'],
    },
    extra: 'yellow',
    completed: false,
    scores: {},
  },
  4: {
    start: {
      1: ['green', 'green', 'green'],
      2: ['green', 'green', 'green'],
      3: ['green', 'green', 'green'],
    },
    end: {
      1: ['white', 'black', 'white'],
      2: ['black', 'cyan', 'black'],
      3: ['black', 'cyan', 'black'],
    },
    extra: 'blue',
    completed: false,
    scores: {},
  },
  5: {
    start: {
      1: ['white', 'cyan', 'white'],
      2: ['white', 'magenta', 'white'],
      3: ['white', 'yellow', 'white'],
    },
    end: {
      1: ['darkRed', 'lightBlue', 'darkGreen'],
      2: ['black', 'white', 'black'],
      3: ['lightGreen', 'darkBlue', 'lightRed'],
    },
    extra: 'black',
    completed: false,
    scores: {},
  },
};

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

// function to respond without json body
const respondJSONMeta = (request, response, status) => {
  // object for our headers
  // Content-Type for json
  const headers = {
    'Content-Type': 'application/json',
  };

  // send response without json object, just headers
  response.writeHead(status, headers);
  response.end();
};

const getPuzzles = (request, response, params) => {
  // get the method type
  const { method } = request;

  if (method === 'GET') {
    if (params.level) {
      if (puzzles[params.level]) {
        return respondJSON(request, response, 200, puzzles[params.level]);
      }
      const responseJSON = {
        message: 'The level requested does not exist',
        id: 'missingLevel',
      };
      return respondJSON(request, response, 400, responseJSON);
    }

    return respondJSON(request, response, 200, puzzles);
  }
  // head request
  return respondJSONMeta(request, response, 200);
};

// update the puzzle to be completed and add the user score for that puzzle
const updatePuzzle = (request, response, body) => {
  console.log(body.level);
  if (body.level && body.score && body.name) {
    if (puzzles[body.level]) {
      puzzles[body.level].completed = true;
      // existing score for player, update it if higher
      if (puzzles[body.level].scores[body.name]) {
        puzzles[body.level].scores[body.name] = puzzles[body.level].scores[body.name] < body.score
          ? body.score : puzzles[body.level].scores[body.name];
        return respondJSONMeta(request, response, 204);
      }
      puzzles[body.level].scores[body.name] = body.score;
      const responseJSON = {
        message: `Successfully added a new user score for puzzle ${body.level}.`,
      };
      return respondJSON(request, response, 201, responseJSON);
    }
  }
  const responseJSON = {
    message: 'Missing fields from post request body',
    id: 'missingFields',
  };
  return respondJSON(request, response, 400, responseJSON);
};

module.exports = {
  getPuzzles,
  updatePuzzle,
};
