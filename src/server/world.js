const Constants = require('../shared/constants');
const { checkCollisions } = require('./collisions');
const Plant = require('./organisms/plant');
const SimpleHerbivore = require('./organisms/simple_herbivore');
const QuadTree = require('./quadtree');

//Saves State of the world
class World {
  constructor() {
    this.players = {};
    this.organisms = [];
    this.deadOrganisms = [];
    this.age = {};

    this.quadTree = new QuadTree(0, { x: 0, y: 0, width: Constants.MAP_SIZE, height: Constants.MAP_SIZE });

    this.identityId = 0;

    this.tickYearRatio = Constants.TICKER_YEAR_RATIO;
  }

  addPlayer(player) {
    this.players[player.id] = player;

    if (player.getMyCreature() === 'plant')
      this.createOrganism(new Plant(this.identityId++, player.id, player.x, player.y, 30, 25, 400));
    else if (player.getMyCreature() === 'herb')
      this.createOrganism(new SimpleHerbivore(this.identityId++, player.id, player.x, player.y, 12, 30, 3.0, 300, 100));
  }

  removePlayer(id) {
    delete this.players[id];
  }

  createOrganism(bornOrganism) {
    //do not create more than 50 creatures for now.
    if (this.organisms.length > 50) return;

    bornOrganism.id = ++this.identityId;
    this.organisms.push(bornOrganism);
    this.quadTree.insert(bornOrganism);
  }

  killOrganism(organism) {
    this.deadOrganisms.push(organism);
  }

  buryDeadOrganisms() {
    this.organisms = this.organisms.filter((organism) => !this.deadOrganisms.includes(organism));
    this.deadOrganisms = [];
  }

  hasLife() {
    return this.organisms.length !== 0;
  }

  increaseYear(tick) {
    var year = ~~(tick / this.tickYearRatio);
    this.age.isNewYear = year !== this.age.year;
    this.age.year = year;
  }

  makeOlder(organism) {
    if (this.age.isNewYear) {
      organism.current.age++;
      //keep track of reprodution wait time
      if (organism.reproductionWaitCounter > 0) {
        organism.reproductionWaitCounter++;
        if (organism.reproductionWaitCounter > Constants.ORGANISM_REPRODUCTION_WAIT_YEARS) organism.reproductionWaitCounter = 0;
      }
    }
  }

  updateState(tick, dt) {
    this.increaseYear(tick);

    this.buryDeadOrganisms();

    this.quadTree.clear();
    this.organisms.forEach((organism) => {
      this.quadTree.insert(organism);
    });

    this.organisms.forEach((organism) => {
      //TODO: when is the best time to check collisions
      var nearByOrganisms = this.quadTree.retrieve(organism.x, organism.y, organism.width, organism.height);
      checkCollisions(organism, nearByOrganisms);
    });

    this.organisms.forEach((organism) => {
      organism.update(this, dt);
    });
  }
}

module.exports = World;
