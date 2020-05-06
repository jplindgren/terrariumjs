const Constants = require('../../../shared/constants');
const Move = require('./move');

class Walk extends Move {
  constructor(x, y, speed, animal) {
    super(x, y, (speed / 2), animal);

    this.staminaCost = Constants.DEFAULT_STAMINA_CONSUME;
  }

  getStaminaCost() {
    return this.staminaCost;
  }
}

module.exports = Walk;
