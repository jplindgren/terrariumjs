const World = require('./world');
const Plant = require('./organisms/plant');
const SimpleHerbivore = require('./organisms/simple_herbivore');

describe('World', () => {
  it('should work', () => {
    const world = new World();
    world.createOrganism(new Plant('id#1', 'owner1', 300, 300, 24, 10, 10));
    world.createOrganism(new SimpleHerbivore('id#2', 'owner1', 300, 300, 24, 10, 10));

    world.updateState(1, 2);

    expect(true).toBe(true);
  });
});
