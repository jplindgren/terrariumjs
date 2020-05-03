const Animal = require('./animal');
const { ORGANISMS_TYPES } = require('./../../shared/constants');

class SimpleHerbivore extends Animal {
  constructor(id, ownerId, x, y, matureSize, hp, speed, eyesight, stamina) {
    super(id, ownerId, x, y, matureSize, hp, speed, eyesight, stamina);

    // TODO: should be in a base class, or some other workaround
    this.type = ORGANISMS_TYPES.HERBIVORE;
  }

  touch(other) {
    console.log('touch', other.x, other.y);
    if (other === this.targetOrganism) {
      console.log('attacking', other.x, other.y);
      this.attack(other);
    }
  }

  idle(world) {
    if (super.canReproduce()) {
      super.beginReproducing(this.current.age - this.matureSize);
      return;
    }

    if (this.targetOrganism && this.targetOrganism.isAlive()) {
      SimpleHerbivore.writeLog('still going for  target: ', this.targetOrganism.id);
      this.moveToTarget();
      return;
    }

    const nearByOrganism = this.scan(world.organisms);
    const target = nearByOrganism.filter(x => x.type === 'plant')
      .sort(x => this.distanceTo(x))[0];
    if (target) {
      this.lookFor(target);
      this.moveToTarget();
    } else if (this.currentMovement && this.distanceTo(this.currentMovement) > this.getSize()) {
      console.log('still walking!: ', this.distanceTo(this.currentMovement));
      this.moveTo(this.currentMovement.x, this.currentMovement.y);
    } else {
      // choose random path to go
      this.currentMovement = this.getRandomPointFrom(500);
      console.log('starting to walk to!! ', this.currentMovement.x, this.currentMovement.y);
      this.moveTo(this.currentMovement.x, this.currentMovement.y);
    }
  }
}

module.exports = SimpleHerbivore;
