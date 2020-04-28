import { updateDirection, changeGameSpeed } from './networking';

function onMouseInput(e) {
  handleInput(e.clientX, e.clientY);
}

function onTouchInput(e) {
  const touch = e.touches[0];
  handleInput(touch.clientX, touch.clientY);
}

function handleInput(x, y) {
  const dir = Math.atan2(x - window.innerWidth / 2, window.innerHeight / 2 - y);
  updateDirection(dir);
}

function onKeyDownInput(event) {
  //minus
  if (event.keyCode === 189 || event.keyCode === 109) {
    //increase the TICKER_YEAR_RATIO, to slower the game
    changeGameSpeed(+10);
    console.log('speed decreased');
  } else if (event.keyCode === 187 || event.keyCode === 107) {
    //plus key
    //the smaller the TICKER_YEAR_RATIO, more fast game
    changeGameSpeed(-10);
    console.log('speed increased');
  }
}

export function startCapturingInput() {
  window.addEventListener('mousemove', onMouseInput);
  window.addEventListener('click', onMouseInput);
  window.addEventListener('touchstart', onTouchInput);
  window.addEventListener('touchmove', onTouchInput);

  window.addEventListener('keydown', onKeyDownInput);
}

export function stopCapturingInput() {
  window.removeEventListener('mousemove', onMouseInput);
  window.removeEventListener('click', onMouseInput);
  window.removeEventListener('touchstart', onTouchInput);
  window.removeEventListener('touchmove', onTouchInput);

  window.removeEventListener('keydown', onKeyDownInput);
}
