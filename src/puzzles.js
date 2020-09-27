//const puzzle vars
const colors = {
    red: [255, 64, 64],
    green: [64, 255, 64],
    blue: [64, 64, 255],
    white: [255, 255, 255],
    black: [0, 0, 0],
    darkRed: [255, 0, 0],
    darkGreen: [0, 255, 0],
    darkBlue: [0, 0, 255],
    lightRed: [255, 128, 128],
    lightGreen: [128, 255, 128],
    lightBlue: [128, 128, 255],
    yellow: [255, 255, 64],
    magenta: [255, 64, 255],
    cyan: [64, 255, 255]

}
const puzzles = {
    1: {
        start: {
            1: [colors.white, colors.white, colors.white],
            2: [colors.white, colors.red, colors.white],
            3: [colors.white, colors.white, colors.white],
        },
        end: {
            1: [colors.yellow, colors.white, colors.yellow],
            2: [colors.white, colors.red, colors.white],
            3: [colors.yellow, colors.white, colors.yellow],
        },
        extra: colors.green
    },
    2: {
        start: {
            1: [colors.white, colors.white, colors.green],
            2: [colors.white, colors.red, colors.white],
            3: [colors.white, colors.white, colors.white],
        },
        end: {
            1: [colors.yellow, colors.cyan, colors.green],
            2: [colors.magenta, colors.red, colors.magenta],
            3: [colors.blue, colors.cyan, colors.yellow],
        },
        extra: colors.blue
    },
    3: {
        start: {
            1: [colors.white, colors.cyan, colors.green],
            2: [colors.white, colors.magenta, colors.white],
            3: [colors.white, colors.white, colors.white],
        },
        end: {
            1: [colors.red, colors.green, colors.green],
            2: [colors.red, colors.cyan, colors.cyan],
            3: [colors.red, colors.yellow, colors.yellow],
        },
        extra: colors.yellow
    },
    4: {
        start: {
            1: [colors.green, colors.green, colors.green],
            2: [colors.green, colors.green, colors.green],
            3: [colors.green, colors.green, colors.green],
        },
        end: {
            1: [colors.white, colors.black, colors.white],
            2: [colors.black, colors.cyan, colors.black],
            3: [colors.black, colors.cyan, colors.black],
        },
        extra: colors.blue
    },
    5: {
        start: {
            1: [colors.white, colors.cyan, colors.white],
            2: [colors.white, colors.magenta, colors.white],
            3: [colors.white, colors.yellow, colors.white],
        },
        end: {
            1: [colors.darkRed, colors.lightBlue, colors.darkGreen],
            2: [colors.black, colors.white, colors.black],
            3: [colors.lightGreen, colors.darkBlue, colors.lightRed],
        },
        extra: colors.black
    },
}

const respondJSON = (request, response, status, object) => {
    response.writeHead(status, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(object));
    response.end();
};

const getPuzzles = (request, response, params) => {
    
    if (params.level) {
        if(puzzles[params.level]){
            return respondJSON(request, response, 200, puzzles[params.level]);
        }
        const responseJSON  = {
            message: "The level requested does not exist",
            id: 'missingLevel'
        }
        return respondJSON(request, response, 400, responseJSON);
    }
    
    return respondJSON(request, response, 200, puzzles);
};

module.exports = {
    getPuzzles
}