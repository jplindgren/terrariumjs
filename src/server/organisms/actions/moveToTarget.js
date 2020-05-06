const Constants = require('../../../shared/constants');
const Action = require('./move');

class MoveToTarget extends Action {
  constructor(target, speed, organismId) {
    super(organismId);

    this.target = target;
    this.speed = speed;
    this.staminaCost = Constants.DEFAULT_STAMINA_CONSUME;
    this.type = Constants.ACTIONS.RUN;
  }

  get x() {
    return this.target.x;
  }

  get y() {
    return this.target.y;
  }

  getStaminaCost() {
    return this.staminaCost * 1.5;
  }
}

module.exports = MoveToTarget;
