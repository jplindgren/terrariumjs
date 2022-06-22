const Carnivore = require('../carnivore');

class SimpleCarnivore extends Carnivore {
  onTouched(other) {
    if (other.isCarnivore() && other.isAlive() && !this.isEating()) {
      if (this.isCurrentHPLowerThan(60)) {
        this.stop();
        this.beginRunning(this.getRandomPointFrom(100, 500));
      } else {
        this.stop();
        this.attack(other);
      }
    } else if (other.isHerbivore() && !other.isAlive() && !this.isEating() && this.isCurrentHPLowerThan(98)) {
      this.stop();
      this.beginEating(other);
    } else if (other.isHerbivore() && !this.isEating()) {
      this.stop();
      this.attack(other);
    }
  }

  walkToRandomPoint() {
    const coords = this.getRandomPointFrom(100, 300);
    this.beginWalking(coords.x, coords.y);
  }

  isCurrentHPLowerThan(percent) {
    return this.current.hp < this.footprint.hp * (percent / 100);
  }

  getTarget(distance) {
    return this.scan(distance)
      .filter(x => x.isHerbivore())
      .sort(x => this.distanceTo(x))[0];
  }

  hunt(target) {
    this.lookFor(target);
    this.beginMoveToTarget();
  }

  scanForPlantAndHunt(distance) {
    const target = this.getTarget(distance);
    if (target) this.hunt(target);
  }

  isCriticalHealth() {
    return this.isCurrentHPLowerThan(10);
  }

  isWarningHealth() {
    return this.isCurrentHPLowerThan(40);
  }

  isGoodHealth() {
    return this.isCurrentHPLowerThan(80);
  }

  // TODO: refactor to not use real organism, instead onIdle would receive a projection
  onIdle() {
    if (super.canReproduce()) {
      super.beginReproducing(this.current.age - this.matureSize);
      return;
    }

    if (this.isEating() && this.isCurrentHPLowerThan(98)) return;

    if (this.isCriticalHealth() && !this.targetOrganism) {
      // critical, conserve energy;
      this.stop();
      this.scanForPlantAndHunt(this.eyesight / 2);
    } else if (this.isWarningHealth()) {
      // dont waste anergy for nothing
      if (!this.targetOrganism || !this.targetOrganism.isAlive()) this.scanForPlantAndHunt(this.eyesight);
    } else if (this.isGoodHealth() && !this.isMoving()) {
      if (!this.targetOrganism) {
        const target = this.scan()
          .filter(x => x.isHerbivore())
          .sort(x => this.distanceTo(x))[0];
        if (target) {
          this.hunt(target);
        } else {
          this.walkToRandomPoint();
        }
      }
    } else if (!this.isMoving()) {
      this.walkToRandomPoint();
    }
  }
}

module.exports = SimpleCarnivore;
