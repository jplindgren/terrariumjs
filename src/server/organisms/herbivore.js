const Animal = require('./animal');
const Eat = require('./actions/eat');
const { ORGANISMS_TYPES, DEFAULT_STAMINA_CONSUME, DEFAULT_DAMAGE } = require('./../../shared/constants');

class Herbivore extends Animal {
  constructor(id, ownerId, x, y, matureSize, hp, speed, eyesight, stamina) {
    super(id, ownerId, x, y, matureSize, hp, speed, eyesight, stamina);

    this.type = ORGANISMS_TYPES.HERBIVORE;
  }

  doPendingActions() {
    super.doPendingActions();
    if (this.isEating()) {
      const eactAction = this.pendingActions.currentAction;
      this.eat(eactAction);
    }
  }

  beginEating(organism) {
    if (organism.isAlive() && organism.type === ORGANISMS_TYPES.PLANT) {
      this.pendingActions.setCurrentAction(new Eat(organism, this.speed));
    }
  }

  eat(eactAction) {
    if (this.current.stamina < DEFAULT_STAMINA_CONSUME) return;

    this.burnStamina(DEFAULT_STAMINA_CONSUME);
    this.current.hp = Math.min(this.footprint.hp, this.current.hp + eactAction.target.takeDamage(DEFAULT_DAMAGE));

    if (this.current.hp === this.footprint.hp || !eactAction.target.isAlive()) this.stop();
  }
}

module.exports = Herbivore;
