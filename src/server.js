const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');
const puzzleHandler = require('./puzzles.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

//added route to get for our ES5 JS bundle. 
//This bundle will be created by our babel 
// watch/build scripts in package.json
const urlStruct = {
  '/': htmlHandler.getIndex,
  '/bundle.js': htmlHandler.getBundle,
  '/success': jsonHandler.success,
  '/badRequest': jsonHandler.badRequest,
  '/puzzle': puzzleHandler.getPuzzles,
  '/client.css': htmlHandler.getStyle,
  notFound: jsonHandler.notFound,
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query);

  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response, params);
  } else {
    urlStruct.notFound(request, response, params);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
