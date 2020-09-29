const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');
const puzzleHandler = require('./puzzles.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// added route to get for our ES5 JS bundle.
// This bundle will be created by our babel
// watch/build scripts in package.json
const urlStructGet = {
  '/': htmlHandler.getIndex,
  '/bundle.js': htmlHandler.getBundle,
  '/puzzle': puzzleHandler.getPuzzles,
  '/client.css': htmlHandler.getStyle,
  notFound: jsonHandler.notFound,
};

const urlStructPost = {
  '/updatePuzzle': puzzleHandler.updatePuzzle,
  notFound: jsonHandler.notFound,
}

// handle POST request for updating the puzzle
const handlePost = (request, response, pathName) => {
  if (urlStructPost[pathName]) {
    const res = response;

    // uploads come in as a byte stream that we need
    // to reassemble once it's all arrived
    const body = [];

    // if the upload stream errors out, just throw a
    // a bad request and send it back
    request.on('error', (err) => {
      console.dir(err);
      res.statusCode = 400;
      res.end();
    });

    // on 'data' is for each byte of data that comes in
    // from the upload. We will add it to our byte array.
    request.on('data', (chunk) => {
      body.push(chunk);
    });

    // on end of upload stream.
    request.on('end', () => {
      // combine our byte array (using Buffer.concat)
      // and convert it to a string value (in this instance)
      const bodyString = Buffer.concat(body).toString();
      // Parse the string into an object
      const bodyParams = JSON.parse(bodyString);

      // call function to handle new data
      urlStructPost[pathName](request, res, bodyParams);
    });
  }
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query);
  const { method } = request;
  // single post method, so if it's that then handle it
  if (method === 'POST') {
    handlePost(request, response, parsedUrl.pathname);
  } else if (urlStructGet[parsedUrl.pathname]) {
    urlStructGet[parsedUrl.pathname](request, response, params);
  } else {
    urlStructGet.notFound(request, response);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
