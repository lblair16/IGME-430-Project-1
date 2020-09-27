const fs = require('fs'); // pull in the file system module

const index = fs.readFileSync(`${__dirname}/../hosted/client.html`);
const style = fs.readFileSync(`${__dirname}/../hosted/client.css`);
// added script to pull in our js bundle. This script is generated
// by our babel build/watch scripts in our package.json
const jsBundle = fs.readFileSync(`${__dirname}/../hosted/DONT_EDIT_bundle.js`);

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getStyle = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(style);
  response.end();
};

// added function to get our js file in our hosted folder.
// This js file is generated by babel build/run package.json.
// This ES5 file is created from the code in our ES6 file (in the client folder)
const getBundle = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/javascript' });
  response.write(jsBundle);
  response.end();
};

module.exports = {
  getIndex,
  getBundle,
  getStyle,
};
