const Constants = require('../shared/constants');
const { checkCollisions } = require('./collisions');
const Plant = require('./organisms/plant');
const SimpleHerbivore = require('./organisms/custom_creatures/simple_herbivore');
const QuadTree = require('./quadtree');
const Tracker = require('./monitoring/tracker');

// Saves State of the world
class World {
  constructor() {
    this.players = {};
    this.organisms = [];
    this.deadOrganisms = [];
    this.age = {};

    this.quadTree = new QuadTree(0, { x: 0, y: 0, width: Constants.MAP_SIZE, height: Constants.MAP_SIZE });

    this.identityId = 0;

    this.tickYearRatio = Constants.TICKER_YEAR_RATIO;
    this.tracker = new Tracker(-1,
      ['onTouched', 'beginReproducing', 'beginMoveToTarget', 'stop', 'beginRunning', 'beginWalking', 'beginEating']);
  }

  addPlayer(player) {
    this.players[player.id] = player;

    if (player.getMyCreature() === Constants.ORGANISMS_TYPES.PLANT) {
      this.createOrganism(new Plant(null, player.id, player.x, player.y, 30, 45, 400));
    } else if (player.getMyCreature() === Constants.ORGANISMS_TYPES.HERBIVORE) {
      this.createOrganism(new SimpleHerbivore(null, player.id, player.x, player.y, 40, 60, 4.0, 300, 100));
    }
  }

  removePlayer(id) {
    delete this.players[id];
  }

  createOrganism(bornOrganism) {
    // limit the creature creation in test phase
    if (this.organisms.length > Constants.WORLD.MAX_ORGANISMS) return;

    // eslint-disable-next-line no-param-reassign
    bornOrganism.id = ++this.identityId;
    this.organisms.push(bornOrganism);
    this.quadTree.insert(bornOrganism);
    this.tracker.tryAddTacker(bornOrganism);
  }

  killOrganism(organism) {
    this.deadOrganisms.push(organism);
  }

  buryDeadOrganisms() {
    this.organisms = this.organisms.filter(organism => !this.deadOrganisms.includes(organism));
    this.deadOrganisms = [];
  }

  hasLife() {
    return this.organisms.length !== 0;
  }

  increaseYear(tick) {
    // eslint-disable-next-line no-bitwise
    const year = ~~(tick / this.tickYearRatio);
    this.age.isNewYear = year !== this.age.year;
    this.age.year = year;

    // temp, game should take care of ticks?
    this.age.currentTick = tick;
  }

  makeOlder(organism) {
    if (this.age.isNewYear) {
      // eslint-disable-next-line no-param-reassign
      organism.current.age++;
      // keep track of reprodution wait time
      if (organism.reproductionWaitCounter > 0) {
        // eslint-disable-next-line no-param-reassign
        organism.reproductionWaitCounter++;
        if (organism.reproductionWaitCounter > Constants.ORGANISM_REPRODUCTION_WAIT_YEARS) {
          // eslint-disable-next-line no-param-reassign
          organism.reproductionWaitCounter = 0;
        }
      }
    }
  }

  updateState(tick, dt) {
    this.increaseYear(tick);

    this.buryDeadOrganisms();

    this.quadTree.clear();
    this.organisms.forEach(organism => {
      this.quadTree.insert(organism);
    });

    this.organisms.forEach(organism => {
      // TODO: when is the best time to check collisions
      const nearByOrganisms = this.quadTree
        .retrieve({ x: organism.x, y: organism.y, width: organism.width, height: organism.height });
      checkCollisions(organism, nearByOrganisms);
    });

    this.organisms.forEach(organism => {
      organism.update(this, dt);
    });
  }
}

module.exports = World;
