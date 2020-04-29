/* eslint-disable no-underscore-dangle */
const Constants = require('../shared/constants');

class Object {
  constructor(id, x, y) {
    this.id = id;
    this._x = x;
    this._y = y;
  }

  get x() {
    return this._x;
  }

  set x(value) {
    this._x = Math.max(0, Math.min(Constants.MAP_SIZE, value));
  }

  get y() {
    return this._y;
  }

  set y(value) {
    this._y = Math.max(0, Math.min(Constants.MAP_SIZE, value));
  }

  distanceTo(object) {
    const dx = this.x - object.x;
    const dy = this.y - object.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  serializeForUpdate() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
    };
  }
}

module.exports = Object;
