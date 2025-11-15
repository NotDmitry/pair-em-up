import {getStartScreen} from "./js/start-screen.js";

const page = getEmbeddedStartScreen();

// Get start page embedded in the document
function getEmbeddedStartScreen() {
  const main = document.createElement('main');
  main.append(getStartScreen());
  document.body.append(main);
  return main;
}