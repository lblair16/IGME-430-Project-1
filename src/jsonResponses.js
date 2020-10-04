// send back json
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};
// send back head request
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

// send back not found message for unknown requests
const notFound = (request, response) => {
  // get the method type
  const { method } = request;
  if (method === 'GET') {
    const responseJSON = {
      message: 'The page you are looking for was not found.',
      id: 'notFound',
    };
    return respondJSON(request, response, 404, responseJSON);
  }
  return respondJSONMeta(request, response, 404);
};

module.exports = {
  notFound,
};
