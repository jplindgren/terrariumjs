const Constants = require('../../../shared/constants');
const Move = require('./move');

class Run extends Move {
  constructor(x, y, speed, animal) {
    super(x, y, speed, animal);

    this.staminaCost = Constants.DEFAULT_STAMINA_CONSUME;
  }

  getStaminaCost() {
    return this.staminaCost * 1.5;
  }
}

module.exports = Run;
