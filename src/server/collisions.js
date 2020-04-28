const Constants = require('../shared/constants');

//THEN COLLISION!!!
//https://developer.mozilla.org/pt-BR/docs/Games/Techniques/2D_collision_detection

function checkCollision(me, other) {
  if (me.id !== other.id && other.isAlive() && me.distanceTo(other) <= me.getSize()) {
    me.touch(other);
  }
}

function checkCollisions(organism, nearbyOrganisms) {
  for (let i = 0; i < nearbyOrganisms.length; i++) {
    let other = nearbyOrganisms[i];
    checkCollision(organism, other);
  }
}

module.exports = {
  checkCollisions: checkCollisions,
  checkCollision: checkCollision,
};
