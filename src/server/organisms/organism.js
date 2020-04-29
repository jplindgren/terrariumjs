/* eslint-disable no-underscore-dangle */
const Constants = require('../../shared/constants');
const ObjectClass = require('./../object');

class Organism extends ObjectClass {
  constructor(id, ownerId, x, y, matureSize, hp, stamina) {
    super(id, x, y);

    this.matureSize = matureSize;
    this.ownerId = ownerId;

    if (hp < 1) throw new Error('An organism cannot be created with less than 1 of energy points');

    this.reproductionWaitCounter = 0;
    this.touched = [];

    this.current = {
      hp,
      age: 0,
      isReproducing: false,
      stamina,
    };

    this.footprint = {
      hp,
      stamina,
    };

    this.width = this.getSize();
    this.height = this.getSize();
  }

  get dt() {
    return this._dt || 1;
  }

  set dt(value) {
    this._dt = value;
  }

  update(world, dt) {
    this.dt = dt;
    this.current.stamina = this.footprint.stamina;

    if (!this.isAlive()) {
      world.killOrganism(this);
      return world;
    }

    world.makeOlder(this);

    this.load(world);

    if (this.current.isReproducing) {
      const child = this.reproduce();
      Organism.writeLog('info', 'organism is reproducing', {
        parentId: this.id,
        child: { id: child.id, age: child.current.age, hp: child.current.hp },
      });
      this.current.isReproducing = false;
      this.onReproductionCompleted(child);
      world.createOrganism(child);
      return world;
    }

    this.idle(world);
    return world;
  }

  // beginning of turn
  // eslint-disable-next-line class-methods-use-this
  load() { }

  // end of turn
  // eslint-disable-next-line class-methods-use-this
  idle() { }

  canReproduce() {
    return this.current.age >= this.matureSize && !this.current.isReproducing && this.reproductionWaitCounter === 0;
  }

  beginReproducing(energySpent) {
    const newHp = this.current.hp - energySpent;
    this.current.hp = newHp >= 0 ? newHp : 0;
    this.current.isReproducing = true;
    this.reproductionWaitCounter = 1;
  }

  static writeLog(message, ...theArgs) {
    if (process.env.NODE_ENV === 'development' && 1 === 2) {
      console.log(message, ...theArgs);
    }
  }

  isAlive() {
    return this.current.hp > 0;
  }

  takeDamage(damage) {
    this.current.hp = Math.max(0, this.current.hp - damage);
    return Constants.DEFAULT_DAMAGE / 2;
  }

  // eslint-disable-next-line class-methods-use-this
  reproduce() { }

  touch(targetOrganism) {
    targetOrganism.onTouched(this);
  }

  onTouched(organism) {
    this.touched.push(organism);
  }

  // eslint-disable-next-line class-methods-use-this
  onReproductionCompleted(child) {
    Organism.writeLog('Called onReproductionCompleted at: ', this.id, 'Child: ', child.id);
  }

  getRadius() {
    return this.current.age > this.matureSize ? Constants.PLAYER_RADIUS : Constants.PLAYER_SMALL_RADIUS;
  }

  getSize() {
    return this.getRadius() * 2;
  }

  consumeStamina() {
    this.current.stamina -= Constants.DEFAULT_STAMINA_CONSUME;
  }

  serializeForUpdate() {
    return {
      ...super.serializeForUpdate(),
      radius: this.getRadius(),
      size: this.getSize(),
      hp: this.current.hp,
      maxHp: this.footprint.hp,
      age: this.current.age,
      isReproducing: this.current.isReproducing,
    };
  }
}

module.exports = Organism;
