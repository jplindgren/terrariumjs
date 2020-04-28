const Plant = require('./plant');

describe('Plant', () => {
  let plant;

  beforeEach(() => {
    plant = new Plant('#1', -10, -10, 24, 12, 1);
  });

  it('serializeForUpdate should return plant serializable data', () => {
    var data = plant.serializeForUpdate();
    expect(data).toHaveProperty('seedSpreadDistance', 'type');
  });

  describe('idle', () => {
    let beginReproducingMock;
    beforeEach(() => {
      beginReproducingMock = jest.fn((energySpent) => plant.eneryPoints - energySpent);
    });
    it.skip('should reproduce if mature', () => {
      plant.age = plant.matureSize + 1;
      const energySpent = plant.age - plant.matureSize;
      plant.idle();

      //TODO: how mock or spy super methods?
      //expect(beginReproducingMock).toHaveBeenLastCalledWith(energySpent);
    });
  });
});
