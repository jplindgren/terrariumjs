const World = require('./world');
const Plant = require('./organisms/plant');
const Simple_Herbivore = require('./organisms/simple_herbivore');

describe('World', () => {
  it('should work', () => {
    let world = new World();
    world.createOrganism(new Plant('id#1', 'owner1', 300, 300, 24, 10, 10));
    world.createOrganism(new Simple_Herbivore('id#2', 'owner1', 300, 300, 24, 10, 10));

    world.updateState(1, 2);

    expect(true).toBe(true);
  });
});
