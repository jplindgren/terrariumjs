const Organism = require('./organism');
const Constants = require('../../shared/constants');

class Plant extends Organism {
  constructor(id, ownerId, x, y, matureSize, hp, seedSpreadDistance) {
    super(id, ownerId, x, y, matureSize, hp, 100);

    this.seedSpreadDistance = seedSpreadDistance;
    this.type = Constants.ORGANISMS_TYPES.PLANT;
  }

  isAlive() {
    return super.isAlive() && this.current.age < Constants.PLANT_MAX_AGE;
  }

  update(world, dt) {
    Plant.writeLog('info', 'Starting plant update', { id: this.id });
    return super.update(world, dt);
  }

  load(world) {
    super.load(world);
  }

  idle(world) {
    super.idle(world);

    Plant.writeLog('info', 'plant idle', { id: this.id });
    if (super.canReproduce()) {
      Plant.writeLog('info', 'begining reproduction', {
        id: this.id,
        age: this.current.age,
        hp: this.current.hp,
      });
      super.beginReproducing(this.current.age - this.matureSize);
    }
  }

  reproduce() {
    super.reproduce();
    const seedPosition = this.getRandomPointFrom(this.seedSpreadDistance);
    const args = [null,
      this.ownerId,
      seedPosition.x,
      seedPosition.y,
      this.matureSize,
      this.footprint.hp,
      this.seedSpreadDistance];
    return new this.constructor(...args);
  }

  onReproductionCompleted(child) {
    super.onReproductionCompleted('base onReproductionCompleted');
    Plant.writeLog('info', 'Plant reproduction completed', { plant: this, child });
  }

  serializeForUpdate() {
    return {
      ...super.serializeForUpdate(),
      seedSpreadDistance: this.seedSpreadDistance,
      type: this.type,
    };
  }
}

module.exports = Plant;
