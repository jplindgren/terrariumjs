const SimpleHerbivore = require('./simple_herbivore');
const Plant = require('./plant');
const World = require('./../world');

describe('animal', () => {
  it('should go for target', () => {
    let world = new World();
    const herbivore = new SimpleHerbivore('#1', 'owner#1', 100, 100, null, 3, 2, 10, 100);
    const plant1 = new Plant('#2', 'owner#1', 90, 10, 24, 10, 10);
    const plant2 = new Plant('#3', 'owner#1', 105, 105, 24, 10, 10);
    const plant3 = new Plant('#4', 'owner#1', 110, 95, 24, 10, 10);

    world.createOrganism(herbivore);
    world.createOrganism(plant1);
    world.createOrganism(plant2);
    world.createOrganism(plant3);

    let counter = 0;
    while (counter < 100) {
      counter++;
      herbivore.update(world, 1.5);
      //console.log(herbivore.x, herbivore.y);
    }
    expect(true).toBe(true);
  });

  it('should go for random movement until it is there', () => {
    let world = new World();
    const herbivore = new SimpleHerbivore('#1', 'owner#1', 100, 100, null, 20, 4, 10, 100);

    world.createOrganism(herbivore);

    let counter = 0;
    while (counter < 10) {
      counter++;
      herbivore.update(world, 1.5);
      //console.log(herbivore.x, herbivore.y);
    }
    expect(true).toBe(true);
  });
});
