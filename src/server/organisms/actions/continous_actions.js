const Constants = require('./../../../shared/constants');

// By now, cannot stack more than one action concurrently
class ContinousActions {
  constructor() {
    this.currentAction = null;
  }

  setCurrentAction(action) {
    this.currentAction = action;
  }

  clearCurrentAction() {
    this.currentAction = null;
  }

  isMoving() {
    return this.currentAction !== null && this.currentAction.type === Constants.ACTIONS.MOVE;
  }

  isEating() {
    return this.currentAction !== null && this.currentAction.type === Constants.ACTIONS.EAT;
  }
}

module.exports = ContinousActions;
