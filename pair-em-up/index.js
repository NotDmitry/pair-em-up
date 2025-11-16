import {getStartScreen} from "./js/start-screen.js";

const app = document.createElement('div');
app.id = 'app';
document.body.append(app);

const startScreen = getStartScreen((type) => alert(type));
showStartScreen(startScreen);

function showStartScreen(startScreen) {
  app.replaceChildren(startScreen);
}