const Herbivore = require('../herbivore');

class SimpleHerbivore extends Herbivore {
  onTouched(other) {
    if (other.isPlant() && !this.isEating() && this.isCurrentHPLowerThan(90)) {
      this.stop();
      this.beginEating(other);
    } else if (other.isCarnivore()) {
      this.stop();
      this.beginRunning(this.getRandomPointFrom(100, 500));
    }
  }

  isCurrentHPLowerThan(percent) {
    return this.current.hp < (this.footprint.hp * (percent / 100));
  }

  walkToRandomPoint() {
    const coords = this.getRandomPointFrom(100, 300);
    this.beginWalking(coords.x, coords.y);
  }

  getTarget(distance) {
    return this.scan(distance)
      .filter(x => x.type === 'plant')
      .sort(x => this.distanceTo(x))[0];
  }

  goForTarget(target) {
    this.lookFor(target);
    this.beginMoveToTarget();
  }

  scanForPlantAndGo(distance) {
    const target = this.getTarget(distance);
    if (target) this.goForTarget(target);
  }

  isCriticalHealth() {
    return this.isCurrentHPLowerThan(20);
  }

  isWarningHealth() {
    return this.isCurrentHPLowerThan(50);
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

    if (this.isEating() && this.isCurrentHPLowerThan(90)) return;

    if (this.isCriticalHealth()) { // critical, conserve energy;
      this.stop();
      this.scanForPlantAndGo(this.eyesight / 2);
    } else if (this.isWarningHealth()) { // dont waste anergy for nothing
      if (!this.targetOrganism || !this.targetOrganism.isAlive()) this.scanForPlantAndGo(this.eyesight);
    } else if (this.isGoodHealth() && !this.isMoving()) {
      if (!this.targetOrganism || !this.targetOrganism.isAlive()) {
        const target = this.scan()
          .filter(x => x.type === 'plant')
          .sort(x => this.distanceTo(x))[0];
        if (target) {
          this.goForTarget(target);
        } else {
          this.walkToRandomPoint();
        }
      }
    } else if (!this.isMoving()) {
      this.walkToRandomPoint();
    }
  }
}

module.exports = SimpleHerbivore;
