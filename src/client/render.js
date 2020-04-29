import { debounce } from 'throttle-debounce';
import { getAsset } from './assets';
import { getCurrentState } from './state';

const Constants = require('../shared/constants');

const { MAP_SIZE } = Constants;

// Get the canvas graphics context
const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');
setCanvasDimensions();

function setCanvasDimensions() {
  // On small screens (e.g. phones), we want to "zoom out" so players can still see at least
  // 800 in-game units of width.
  const scaleRatio = Math.max(1, 800 / window.innerWidth);
  canvas.width = scaleRatio * window.innerWidth;
  canvas.height = scaleRatio * window.innerHeight;
}

window.addEventListener('resize', debounce(40, setCanvasDimensions));

function render() {
  const { me, others } = getCurrentState();
  if (!me) {
    return;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.save();

  // Draw background
  renderBackground(me.x, me.y);

  // Draw boundaries
  context.strokeStyle = 'black';
  context.lineWidth = 1;
  context.strokeRect(canvas.width / 2 - me.x, canvas.height / 2 - me.y, MAP_SIZE, MAP_SIZE);

  // Draw all organisms
  others.forEach(renderOrganism.bind(null, me));
}

function renderBackground(x, y) {
  const backgroundX = MAP_SIZE / 2 - x + canvas.width / 2;
  const backgroundY = MAP_SIZE / 2 - y + canvas.height / 2;
  const backgroundGradient = context.createRadialGradient(
    backgroundX,
    backgroundY,
    MAP_SIZE / 10,
    backgroundX,
    backgroundY,
    MAP_SIZE / 2,
  );
  backgroundGradient.addColorStop(0, 'black');
  backgroundGradient.addColorStop(1, 'gray');
  context.fillStyle = backgroundGradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
}

// Renders a ship at the given coordinates
function renderOrganism(me, organism) {
  // TODO: why is comming NaN?
  if (
    organism.type !== 'plant' &&
    organism.type !== 'plantNaN' &&
    organism.type !== 'herb' &&
    organism.type !== 'herbNaN' &&
    organism.type !== 'carn' &&
    organism.type !== 'carnNaN'
  ) {
    return;
  }

  const { x, y } = organism;
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;

  // Draw ship
  context.save();
  context.translate(canvasX, canvasY);
  // context.rotate(direction);

  if (organism.type === 'plant' || organism.type === 'plantNaN') {
    context.drawImage(getAsset('arvore.svg'), -organism.radius, -organism.radius, organism.size, organism.size);
  } else {
    context.drawImage(getAsset('herbivore.svg'), -organism.radius, -organism.radius, organism.size, organism.size);
    // context.arc(0, 0, organism.eyesight, 0, Math.PI * 2, false);
    // context.strokeStyle = 'white';
    // context.stroke();
  }
  context.restore();

  // Draw health bar
  context.fillStyle = 'white';
  context.fillRect(canvasX - organism.radius, canvasY + organism.radius + 8, organism.size, 2);
  context.fillStyle = 'red';
  context.fillRect(
    canvasX - organism.radius + (organism.size * organism.hp) / organism.maxHp,
    canvasY + organism.radius + 8,
    organism.size * (1 - organism.hp / organism.maxHp),
    2,
  );
}

function renderMainMenu() {
  const t = Date.now() / 7500;
  const x = MAP_SIZE / 2 + 800 * Math.cos(t);
  const y = MAP_SIZE / 2 + 800 * Math.sin(t);
  renderBackground(x, y);
}

let renderInterval = setInterval(renderMainMenu, 1000 / 60);

// Replaces main menu rendering with game rendering.
export function startRendering() {
  clearInterval(renderInterval);
  renderInterval = setInterval(render, 1000 / Constants.SPEED_PER_SECOND_RATIO);
}

// Replaces game rendering with main menu rendering.
export function stopRendering() {
  clearInterval(renderInterval);
  renderInterval = setInterval(renderMainMenu, 1000 / Constants.SPEED_PER_SECOND_RATIO);
}
