import { debounce } from 'throttle-debounce';
import { getAsset, test } from './assets';
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

  console.log('HOW MANY TIMES');

  const assetMapper = assetTypeMapper();

  // Draw boundaries
  context.strokeStyle = 'black';
  context.lineWidth = 1;
  context.strokeRect(canvas.width / 2 - me.x, canvas.height / 2 - me.y, MAP_SIZE, MAP_SIZE);

  // Draw all organisms
  others.sort((x) => x.fixed.type).forEach(renderOrganism.bind(null, me, assetMapper));

  // requestAnimationFrame(render);
}

function assetTypeMapper() {
  const mapper = {};
  mapper[Constants.ORGANISMS_TYPES.PLANT] = 'arvore_minified.svg';
  mapper[Constants.ORGANISMS_TYPES.HERBIVORE] = 'herbivore_minified.svg';
  mapper[Constants.ORGANISMS_TYPES.CARNIVORE] = 'carnivore_minified.svg';
  return mapper;
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

  //TODO: add background tileset, but we have to load it outside the re-render
  // var ptrn = context.createPattern(getAsset('terrain1.jpg'), 'repeat'); // Create a pattern with this image, and set it to "repeat".
  // context.fillStyle = ptrn;
  // context.fillRect(0, 0, canvas.width, canvas.height); // context.fillRect(x, y, width, height);
}

// Renders a ship at the given coordinates
function renderOrganism(me, assetMapper, organism) {
  if (
    organism.fixed.type !== Constants.ORGANISMS_TYPES.PLANT &&
    organism.fixed.type !== Constants.ORGANISMS_TYPES.HERBIVORE &&
    organism.fixed.type !== Constants.ORGANISMS_TYPES.CARNIVORE
  ) {
    return;
  }

  const { x, y } = organism;
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;
  const organismRadius = organism.fixed.radius;
  const organismSize = organism.fixed.size;

  // Draw organism
  context.save();
  context.translate(canvasX, canvasY);
  // context.rotate(direction);

  const asset = assetMapper[organism.fixed.type];

  context.drawImage(getAsset(asset), -organismRadius, -organismRadius, organismSize, organismSize);
  // context.arc(0, 0, organism.eyesight, 0, Math.PI * 2, false);
  // context.strokeStyle = 'white';
  // context.stroke();

  context.restore();

  // Draw health bar
  context.fillStyle = 'white';
  context.fillRect(canvasX - organismRadius, canvasY + organismRadius + 8, organismSize, 2);
  context.fillStyle = 'red';
  context.fillRect(
    canvasX - organismRadius + (organismSize * organism.hp) / organism.maxHp,
    canvasY + organismRadius + 8,
    organismSize * (1 - organism.hp / organism.maxHp),
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
