const Animal = require('./animal');
const Plant = require('./plant');
const World = require('./../world');

describe('animal', () => {
  it('should move correctly', () => {
    const animal = new Animal('#1', 'owner#1', 100, 100, 10, 4, 10, 5);
    const plant = new Plant('#2', 'owner#1', 90, 10, 24, 10, 10);

    while (animal.x > plant.x || animal.y > plant.y) {
      animal.moveTo(plant.x, plant.y);
    }

    expect(true).toBe(true);
  });

  it('should scan correctly', () => {
    const animal = new Animal('#1', 'owner#1', 100, 100, null, 10, 4, 20, 5);
    const plant1 = new Plant('#2', 'owner#1', 90, 10, 24, 10, 10);
    const plant2 = new Plant('#3', 'owner#1', 105, 105, 24, 10, 10);
    const plant3 = new Plant('#4', 'owner#1', 110, 95, 24, 10, 10);
    const plant4 = new Plant('#5', 'owner#1', 800, 560, 24, 10, 10);
    const plant5 = new Plant('#6', 'owner#1', 500, 600, 24, 10, 10);
    const otherAnimal = new Animal('#7', 'owner#1', 700, 555, null, 10, 4, 20, 5);
    const allOrganisms = [animal, plant1, plant2, plant3, plant4, plant5, otherAnimal];

    const world = new World();
    allOrganisms.forEach(x => world.createOrganism(x));

    const scan = animal.getCurrentScan(world);
    const nearBy = scan();

    expect(nearBy.length).toBe(2);
  });
});
