const Animal = require('./animal');

class SimpleHerbivore extends Animal {
  constructor(id, ownerId, x, y, matureSize, hp, speed, eyesight, stamina) {
    super(id, ownerId, x, y, matureSize, hp, speed, eyesight, stamina);

    this.type = 'herb';
  }

  touch(other) {
    console.log('touch', other.x, other.y);
    if (other === this.targetOrganism) {
      console.log('attacking', other.x, other.y);
      this.attack(other);
    }
  }

  idle(world) {
    if (this.targetOrganism && this.targetOrganism.isAlive()) {
      this.writeLog('still going for  target: ', this.targetOrganism.id);
      this.moveToTarget();
      return;
    }

    var nearByOrganism = this.scan(world.organisms);
    var target = nearByOrganism[0];
    if (target) {
      this.lookFor(target);
      this.moveToTarget();
      return;
    } else {
      if (this.currentMovement && this.distanceTo(this.currentMovement) > this.getSize()) {
        console.log('still walking!: ', this.distanceTo(this.currentMovement));
        this.moveTo(this.currentMovement.x, this.currentMovement.y);
      } else {
        //choose random path to go
        var mx = this.x + Math.random() * 500;
        var my = this.y + Math.random() * 500;
        this.currentMovement = { x: mx, y: my };
        console.log('starting to walk to!! ', mx, my);
        this.moveTo(mx, my);
      }
    }
  }
}

module.exports = SimpleHerbivore;
