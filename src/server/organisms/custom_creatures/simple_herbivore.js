const Herbivore = require('../herbivore');

class SimpleHerbivore extends Herbivore {
  onTouched(other) {
    if (other.isPlant()) {
      this.stop();
      this.beginEating(other);
    }
  }

  isCurrentHPLowerThan(percent) {
    return this.current.hp < (this.footprint.hp * percent);
  }

  // TODO: refactor to not use real organism, instead onIdle would receive a projection
  onIdle() {
    if (super.canReproduce()) {
      super.beginReproducing(this.current.age - this.matureSize);
      return;
    }

    if (this.isEating() && this.isCurrentHPLowerThan(90)) return;

    if (this.current.hp < (this.footprint.hp * 0.2)) { // critical, conserve energy;
      this.stopMovement();
      const nearOrganisms = this.scan(this.eyesight / 2)
        .filter(x => x.type === 'plant')
        .sort(x => this.distanceTo(x));
      if (nearOrganisms.length !== 0) {
        this.lookFor(nearOrganisms[0]);
        this.beginMoveToTarget();
      }
    } else if (this.current.hp < (this.footprint.hp * 0.5)) { // dont waste anergy for nothing
      if (!this.targetOrganism || !this.targetOrganism.isAlive()) {
        const nearByOrganism = this.scan();
        const target = nearByOrganism.filter(x => x.type === 'plant')
          .sort(x => this.distanceTo(x))[0];
        this.lookFor(target);
        this.beginMoveToTarget();
      }
    } else if (this.current.hp < (this.footprint.hp * 0.80 && !this.isMoving())) {
      if (!this.targetOrganism || !this.targetOrganism.isAlive()) {
        const nearByOrganism = this.scan();
        const target = nearByOrganism.filter(x => x.type === 'plant')
          .sort(x => this.distanceTo(x))[0];
        if (target) {
          this.lookFor(target);
          this.beginMoveToTarget();
        } else {
          const coords = this.getRandomPointFrom(500);
          // console.log('starting to walk to!! ', coords.x, coords.y);
          this.beginWalking(coords.x, coords.y);
        }
      }
    } else if (!this.isMoving()) {
      const coords = this.getRandomPointFrom(500);
      // console.log('starting to walk to!! ', coords.x, coords.y);
      this.beginWalking(coords.x, coords.y);
    }
  }
}

module.exports = SimpleHerbivore;
