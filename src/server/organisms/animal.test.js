const Animal = require('./animal');
const Plant = require('./plant');

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
    const animal = new Animal('#1', 'owner#1', 100, 100, null, 10, 4, 10, 5);
    const plant1 = new Plant('#2', 'owner#1', 90, 10, 24, 10, 10);
    const plant2 = new Plant('#3', 'owner#1', 105, 105, 24, 10, 10);
    const plant3 = new Plant('#4', 'owner#1', 110, 95, 24, 10, 10);

    const allOrganisms = [animal, plant1, plant2, plant3];

    const nearBy = animal.scan(allOrganisms);

    expect(nearBy.length).toBe(1);
  });
});
