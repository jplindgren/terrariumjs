const Constants = require('../../../shared/constants');
const Action = require('./action');

/* eslint-disable no-underscore-dangle */
class Move extends Action {
  constructor(x, y, speed, organismId) {
    super(organismId);
    this._x = Math.max(0, Math.min(Constants.MAP_SIZE, x));
    this._y = Math.max(0, Math.min(Constants.MAP_SIZE, y));
    this.speed = speed;
    this.type = Constants.ACTIONS.MOVE;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }
}

module.exports = Move;
