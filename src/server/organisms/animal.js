/* eslint-disable no-underscore-dangle */
const Constants = require('../../shared/constants');
const Organism = require('./organism');
const Walk = require('./actions/walk');
const Run = require('./actions/run');
const MoveToTarget = require('./actions/moveToTarget');

class Animal extends Organism {
  constructor(id, ownerId, x, y, matureSize, hp, speed, eyesight, stamina, generation) {
    super(id, ownerId, x, y, matureSize, hp, stamina, generation);

    this.speed = speed;
    this.eyesight = eyesight;

    this.targetOrganism = null;
  }

  isAlive() {
    return super.isAlive() && this.current.age < Constants.ANIMAL_MAX_AGE;
  }

  update(world, dt) {
    return super.update(world, dt);
  }

  load(_world) {
    this.scan = this.getCurrentScan(_world);
    super.load(_world);
  }

  idle(_world) {
    super.idle(_world);
    this.doPendingActions();
  }

  // Scan should not return organisms itself, just a visible projection of the organism to the user.
  getCurrentScan(_world) {
    return distance => {
      const eyeSight = Math.max(this.eyesight, distance) || this.eyesight;
      const nearByOrganisms = _world.quadTree.retrieve2({ x: this.x, y: this.y, width: eyeSight, height: eyeSight });
      // const nearByOrganisms = this.world.organisms
      // .filter(o => o.id !== this.id && o.distanceTo(this) <= this.eyesight);
      return nearByOrganisms.filter(o => o.id !== this.id && o.distanceTo(this) <= eyeSight);
    };
  }

  lookFor(organism) {
    // todo: implements camouflage for the target?
    this.targetOrganism = organism;
  }

  moveToTarget() {
    if (this.distanceTo(this.targetOrganism) > this.getSize()) {
      this.moveTo(this.targetOrganism.x, this.targetOrganism.y);
    }
  }

  attack(other) {
    // atack should be separated from damage?
    if (this.current.stamina < Constants.DEFAULT_STAMINA_CONSUME) return;

    this.burnStamina(Constants.DEFAULT_STAMINA_CONSUME);
    this.current.hp = Math.min(this.footprint.hp, this.current.hp + other.takeDamage(Constants.DEFAULT_DAMAGE));
  }

  beginWalking(dx, dy) {
    this.pendingActions.setCurrentAction(new Walk(dx, dy, this.speed));
  }

  beginRunning(dx, dy) {
    this.pendingActions.setCurrentAction(new Run(dx, dy, this.speed));
  }

  stop() {
    this.targetOrganism = null;
    this.pendingActions.clearCurrentAction();
  }

  beginMoveToTarget() {
    this.pendingActions.setCurrentAction(new MoveToTarget(this.targetOrganism, this.speed));
  }

  // temporary
  moveTo(dx, dy) {
    /*
    if (this.current.stamina < Constants.DEFAULT_STAMINA_CONSUME) return;
    this.consumeStamina();
    this.takeDamage(Constants.DEFAULT_MOVEMENT_COST);

    const dirAngle = Math.atan2(dy - this.y, dx - this.x);
    this.x += this.dt * this.speed * Math.cos(dirAngle);
    this.y += this.dt * this.speed * Math.sin(dirAngle);
    */
    this.customMove(new Walk(dx, dy, this.speed));
  }

  // using angles
  // in future take in account, size, distance to generate cost
  customMove(moveToAction) {
    if (this.current.stamina < moveToAction.getStaminaCost()) return;
    this.burnStamina(moveToAction.getStaminaCost());
    if (this.current.hp > (this.footprint.hp * 0.2)) this.takeDamage(Constants.DEFAULT_MOVEMENT_COST);

    const dirAngle = Math.atan2(moveToAction.y - this.y, moveToAction.x - this.x);
    this.x += this.dt * this.speed * Math.cos(dirAngle);
    this.y += this.dt * this.speed * Math.sin(dirAngle);
  }

  // No Atan, just linear algebra
  moveTo2(organism) {
    const dx = organism.x - this.x;
    const dy = organism.y - this.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    // normalize
    const ndx = dx / length;
    const ndy = dy / length;

    this.x += ndx * this.speed;
    this.y += ndy * this.speed;
  }

  beginReproducing(energySpent) {
    this.currentMovement = null;
    return super.beginReproducing(energySpent);
  }

  isMoving() {
    return this.pendingActions.isMoving();
  }

  isEating() {
    return this.pendingActions.isEating();
  }

  doPendingActions() {
    if (this.isMoving()) {
      const moveAction = this.pendingActions.currentAction;
      this.customMove(moveAction);
      if (this.distanceTo(moveAction) < this.getSize()) {
        if (typeof this.onMoveCompleted === 'function') this.onMoveCompleted(moveAction);
        this.pendingActions.clearCurrentAction();
      }
    }
  }

  // TODO: THis is a problem. How put this method on animal class?
  reproduce() {
    super.reproduce();
    const bornPosition = this.getRandomPointFrom(this.getSize(), 80);
    const args = [null,
      this.ownerId,
      bornPosition.x,
      bornPosition.y,
      this.matureSize,
      this.footprint.hp,
      this.speed,
      this.eyesight,
      this.footprint.stamina,
    ];
    return new this.constructor(...args);
  }

  serializeForUpdate() {
    return {
      ...super.serializeForUpdate(),
      type: this.type,
    };
  }
}

module.exports = Animal;
