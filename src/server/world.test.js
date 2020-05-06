const World = require('./world');
const Plant = require('./organisms/plant');
const SimpleHerbivore = require('./organisms/custom_creatures/simple_herbivore');

describe('World', () => {
  it('should work', () => {
    const world = new World();
    world.createOrganism(new Plant('id#1', 'owner1', 300, 300, 24, 10, 10));
    world.createOrganism(new SimpleHerbivore('id#2', 'owner1', 300, 300, 24, 10, 10, 200, 100));

    world.updateState(1, 2);

    expect(true).toBe(true);
  });

  it('should work until begin reproduce', () => {
    const world = new World();
    world.createOrganism(new SimpleHerbivore('id#2', 'owner1', 300, 300, 1, 10, 10, 200, 100));

    let counter = 0;
    while (counter < 20) {
      world.updateState(1, 2);
      counter++;
    }
    expect(true).toBe(true);
  });
});
