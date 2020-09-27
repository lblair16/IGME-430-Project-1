/**#ES6 file to be converted into an ES5 file
    Our babel build/watch scripts in the package.json
    will convert this into ES5 and put it into the hosted folder.
**/

const handleResponse = (xhr) => {
  const content = document.querySelector("#content");

  const obj = JSON.parse(xhr.response);

  console.dir(obj);

  switch(xhr.status) {
    case 200: 
      content.innerHTML = `<b>Success</b>`;
      break;
    case 400:
      content.innerHTML = `<b>Bad Request</b>`;
      break;
    default: 
      content.innerHTML = `Error code not implemented by client.`;
      break;
  }
};

const sendAjax = (url) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.setRequestHeader ("Accept", 'application/json');

  xhr.onload = () => handleResponse(xhr);

  xhr.send();
};

const loadPuzzle = (e) => {
  
}

const init = () => {
  const puzzle = document.querySelector("#puzzle");
  puzzle.innerHTML = `<p>me working</>`
  const badRequestButton = document.querySelector("#badRequest");
  const notFoundButton = document.querySelector("#notFound");

  const success = () => sendAjax('/success');
  const badRequest = () => sendAjax('/badRequest');
  const notFound = () => sendAjax('/notFoundURL');

  successButton.addEventListener('click', success);
  badRequestButton.addEventListener('click', badRequest);
  notFoundButton.addEventListener('click', notFound);
};

window.onload = init;