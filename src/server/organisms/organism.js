/* eslint-disable no-underscore-dangle */
const Constants = require('../../shared/constants');
const ObjectClass = require('./../object');
const ContinousActions = require('./actions/continous_actions');

class Organism extends ObjectClass {
  constructor(id, ownerId, x, y, matureSize, hp, stamina, generation) {
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
    this.pendingActions = new ContinousActions();
    this.generation = generation;
  }

  get dt() {
    return this._dt || 1;
  }

  set dt(value) {
    this._dt = value;
  }

  update(world, dt) {
    this.dt = dt;
    this.tick = world.age.currentTick; // TODO: remove. need to tracker right now.
    this.current.stamina = this.footprint.stamina;

    if (!this.isAlive()) {
      world.killOrganism(this);
      this.clean();
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
      this.clean();
      return world;
    }

    this.idle(world);
    this.clean();
    return world;
  }

  // beginning of turn
  // eslint-disable-next-line no-unused-vars
  load(_world) {
    // maybe we can pass an interface with all visible organism state to the onLoad of the user organism.
    if (typeof this.onLoad === 'function') this.onLoad();
  }

  // end of turn
  // eslint-disable-next-line no-unused-vars
  idle(_world) {
    // maybe we can pass an interface with all visible organism state to the onLoad of the user organism.
    if (typeof this.onIdle === 'function') this.onIdle();
  }

  clean() {
    this.touched = [];
  }

  canReproduce() {
    return this.current.hp > (this.footprint.hp * 0.75) &&
      this.current.age >= this.matureSize &&
      !this.current.isReproducing &&
      this.reproductionWaitCounter === 0;
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
    return damage * this.getSize() * Constants.DEFAULT_DAMAGE_TAKEN_MODIFIER;
  }

  // eslint-disable-next-line class-methods-use-this
  reproduce() { }

  touch(otherOrganism) {
    this.touched.push(otherOrganism);
    if (typeof this.onTouched === 'function') this.onTouched(otherOrganism);
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

  burnStamina(spent) {
    this.current.stamina -= spent;
  }

  hasEnoughStamina(staminaCost) {
    return this.current.stamina > staminaCost;
  }

  isPlant() {
    return this.type === Constants.ORGANISMS_TYPES.PLANT;
  }

  isHerbivore() {
    return this.type === Constants.ORGANISMS_TYPES.HERBIVORE;
  }

  isCarnivore() {
    return this.type === Constants.ORGANISMS_TYPES.CARNIVORE;
  }

  serializeForUpdate() {
    return {
      ...super.serializeForUpdate(),
      hp: this.current.hp,
      maxHp: this.footprint.hp,
      fixed: {
        radius: this.getRadius(),
        size: this.getSize(),
        type: this.type,
      },
    };
  }
}

module.exports = Organism;
