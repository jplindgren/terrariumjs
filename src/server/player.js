const ObjectClass = require('./object');
const Constants = require('../shared/constants');

class Player extends ObjectClass {
  constructor(id, username, x, y, speed) {
    super(id, x, y);
    this.username = username;
    this.score = 0;
    this.speed = speed;
  }

  move(dir) {
    this.x += this.speed * Math.sin(dir);
    this.y -= this.speed * Math.cos(dir);

    // Make sure the player stays in bounds
    this.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.x));
    this.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.y));
  }

  // TODO: remove
  getMyCreature() {
    return this.username;
  }

  serializeForUpdate() {
    return {
      ...super.serializeForUpdate(),
    };
  }
}

module.exports = Player;
