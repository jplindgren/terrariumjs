/* eslint-disable no-underscore-dangle */
const Constants = require('../../shared/constants');
const Organism = require('./organism');

class Animal extends Organism {
  constructor(id, ownerId, x, y, matureSize, hp, speed, eyesight, stamina) {
    super(id, ownerId, x, y, matureSize, hp, stamina);

    this.speed = speed;
    this.eyesight = eyesight;

    this._targetOrganism = null;
    this._currentMovement = null;
  }

  get targetOrganism() {
    return this._targetOrganism;
  }

  set targetOrganism(value) {
    this._targetOrganism = value;
    this._currentMovement = null;
  }

  get currentMovement() {
    return this._currentMovement;
  }

  set currentMovement(value) {
    this._currentMovement = value;
    this._targetOrganism = null;
  }

  update(world, dt) {
    return super.update(world, dt);
  }

  // should receive an abstraction of the world state?
  scan(otherOrganisms) {
    const nearbyOrganisms = otherOrganisms.filter(o => o.id !== this.id && o.distanceTo(this) <= this.eyesight);
    return nearbyOrganisms;
  }

  lookFor(organism) {
    // todo: implements camouflage for the target?
    this.targetOrganism = organism;
  }

  moveToTarget() {
    this.moveTo(this.targetOrganism.x, this.targetOrganism.y);
  }

  touch(other) {
    Animal.writeLog('Animal: ', this.id, 'Touch: ', other.id);
  }

  attack(other) {
    // atack should be separated from damage?
    if (this.current.stamina < Constants.DEFAULT_STAMINA_CONSUME) return;

    this.consumeStamina();
    this.current.hp = Math.max(0, this.current.hp + other.takeDamage(Constants.DEFAULT_DAMAGE));
  }

  // using angles
  moveTo(dx, dy) {
    if (this.current.stamina < Constants.DEFAULT_STAMINA_CONSUME) return;
    this.consumeStamina();
    this.takeDamage(Constants.DEFAULT_MOVEMENT_COST);

    const dirAngle = Math.atan2(dy - this.y, dx - this.x);
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

  serializeForUpdate() {
    return {
      ...super.serializeForUpdate(),
      type: this.type,
      eyesight: this.eyesight,
    };
  }
}

module.exports = Animal;
