const Action = require('./action');
const Constants = require('./../../../shared/constants');

class Eat extends Action {
  constructor(target, organismId) {
    super(organismId);

    this.type = Constants.ACTIONS.EAT;
    this.target = target;
  }
}

module.exports = Eat;
