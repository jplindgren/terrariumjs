const SimpleHerbivore = require('../server/organisms/simple_herbivore');
const Plant = require('../server/organisms/plant');
const World = require('../server/world');
const Constants = require('../shared/constants');

describe('World', () => {
  let world;
  let tick;
  let herbivore;
  beforeAll(async () => {
    world = new World();
    tick = 1;
    herbivore = new SimpleHerbivore('#1', 'owner#1', 100, 100, 30, 100, 2, 100, 100);
    world.createOrganism(herbivore);
  });
  it('from tick 1-10 herbivore is created alone it should walk randomically losing energy and stamina', () => {
    world.updateState(tick, 1.5);
    expect(herbivore.currentMovement).toBeTruthy();

    const initialDistance = herbivore.distanceTo(herbivore.currentMovement);

    while (tick <= 10) {
      tick++;
      world.updateState(tick, 1.5);
      const newDistance = herbivore.distanceTo(herbivore.currentMovement);
      expect(newDistance).toBeLessThan(initialDistance);
      expect(herbivore.current.stamina).toBe(herbivore.footprint.stamina - Constants.DEFAULT_STAMINA_CONSUME);
      expect(herbivore.current.hp).toBeLessThan(herbivore.footprint.hp);
    }
  });
  it('from tick 11-20 plant is created and herbivore should target it', () => {
    const farPlant = new Plant('#2', 'owner#1', 400, 400, 30, 100, 10);
    const nearPlant = new Plant('#2', 'owner#1', 100, 100, 30, 100, 2);
    world.createOrganism(farPlant);
    world.createOrganism(nearPlant);

    world.updateState(tick, 1.5);
    expect(herbivore.targetOrganism).toBe(nearPlant);
    expect(herbivore.currentMovement).toBeFalsy();

    const originalDistanceToTarget = herbivore.distanceTo(herbivore.targetOrganism);

    while (tick <= 15) {
      tick++;
      world.updateState(tick, 1.5);
      const newDistanceToTarget = herbivore.distanceTo(herbivore.targetOrganism);
      expect(newDistanceToTarget).toBeLessThan(originalDistanceToTarget);
    }
  });
});
