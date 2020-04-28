const Organism = require('./organism');
const Constants = require('../../shared/constants');
var uuid = require('uuid');

class Plant extends Organism {
  constructor(id, ownerId, x, y, matureSize, hp, seedSpreadDistance) {
    super(id, ownerId, x, y, matureSize, hp, 100);

    this.seedSpreadDistance = seedSpreadDistance;
    this.type = 'plant';
  }

  isAlive() {
    return super.isAlive() && this.current.age < Constants.PLANT_MAX_AGE;
  }

  update(world, dt) {
    this.writeLog('info', 'Starting plant update', { id: this.id });
    return super.update(world, dt);
  }

  load(world) {
    super.load(world);
  }

  idle(world) {
    super.idle(world);

    this.writeLog('info', 'plant idle', { id: this.id });
    if (super.canReproduce()) {
      this.writeLog('info', 'begining reproduction', {
        id: this.id,
        age: this.current.age,
        hp: this.current.hp,
      });
      super.beginReproducing(this.current.age - this.matureSize);
    }
  }

  createSeed() {
    var angle = Math.random() * Math.PI * 2;
    var radius = Math.random() * this.seedSpreadDistance;
    const x = Math.max(0, Math.min(Constants.MAP_SIZE, this.x + radius * Math.cos(angle)));
    const y = Math.max(0, Math.min(Constants.MAP_SIZE, this.y + radius * Math.sin(angle)));

    return { x: x, y: y };
  }

  /*
  createSeed2() {
    var r = Math.random() * this.seedSpreadDistance;
    var theta = Math.random() * 360;
    const x = Math.max(0, Math.min(Constants.MAP_SIZE, Math.sqrt(r) * Math.cos(theta)));
    const y = Math.max(0, Math.min(Constants.MAP_SIZE, Math.sqrt(r) * Math.sin(theta)));
    return { x: x, y: y };
  }
  */

  reproduce() {
    super.reproduce();
    var seedPosition = this.createSeed();
    return new Plant(
      null,
      this.ownerId,
      seedPosition.x,
      seedPosition.y,
      this.matureSize,
      this.footprint.hp,
      this.seedSpreadDistance,
    );
  }

  onReproductionCompleted(child) {
    super.onReproductionCompleted('base onReproductionCompleted');
    this.writeLog('info', 'Plant reproduction completed', { plant: this, child: child });
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
