const Organism = require('./organism');
const World = require('./../world');

describe('Organism', () => {
  let organism;
  beforeEach(() => {
    organism = new Organism('#1', 'owner#1', -10, -10, 24, 12);
  });
  it('should be created with age zero and not reproducing', () => {
    expect(organism.current.age).toBe(0);
    expect(organism.current.isReproducing).toBe(false);
  });

  it('should not be possible to create with 0 or less energy points', () => {
    const hp = -12;
    expect(() => {
      // eslint-disable-next-line no-new
      new Organism(1, 'onwer#1', -10, -10, 24, hp);
    }).toThrow('An organism cannot be created with less than 1 of energy points');
  });

  it('should be death if hp is equal or less than zero', () => {
    organism.current.hp = 0;
    expect(organism.isAlive()).toBe(false);
  });

  it('serializeForUpdate should return organism serializable data', () => {
    const data = organism.serializeForUpdate();
    expect(data).toHaveProperty('id', 'x', 'y', 'matureSize', 'radius', 'size', 'hp', 'maxHp', 'age', 'isReproducing');
  });

  describe('CanReproduce', () => {
    beforeAll(() => {
      organism.matureSize = 24;
    });
    it('should be false if age is less than mature size', () => {
      organism.current.age = 23;

      expect(organism.canReproduce()).toBeFalsy();
    });

    it('should be false if already is reproducing', () => {
      organism.current.age = 25;
      organism.current.isReproducing = true;

      expect(organism.canReproduce()).toBeFalsy();
    });

    it('should be true if age is greater or equal mature size', () => {
      organism.current.age = 24;

      expect(organism.canReproduce()).toBeTruthy();
    });
  });

  describe('Update', () => {
    let loadSpy;
    let idleSpy;
    let world;
    beforeEach(() => {
      loadSpy = jest.spyOn(organism, 'load');
      idleSpy = jest.spyOn(organism, 'idle');
      world = new World();
    });
    it('should not execute and notify when not alive', () => {
      organism.current.hp = -2;

      organism.update(world);

      expect(world.deadOrganisms.length).toBe(1);
      expect(world.deadOrganisms[0]).toBe(organism);

      expect(loadSpy).not.toHaveBeenCalled();
      expect(idleSpy).not.toHaveBeenCalled();
    });

    it('should make the organism older', () => {
      const initialAge = organism.current.age;
      world.age.isNewYear = true;
      organism.update(world);

      expect(organism.current.age).toBe(initialAge + 1);

      organism.update(world);
      expect(organism.current.age).toBe(initialAge + 2);
    });

    describe('When reproducing', () => {
      let reproduceMock;
      let onReproductionCompletedSpy;
      beforeEach(() => {
        onReproductionCompletedSpy = jest.spyOn(organism, 'onReproductionCompleted');
        reproduceMock = jest.fn(() => new Organism('#2', 10, 8, 24, 10));

        organism.current.isReproducing = true;
        organism.reproduce = reproduceMock;
      });

      it('should notify world state when child is created', () => {
        organism.update(world);
        expect(world.organisms.length).toBe(1);
      });

      it('should call load and not call idle', () => {
        organism.update(world);
        expect(loadSpy).toHaveBeenCalledTimes(1);
        expect(idleSpy).not.toHaveBeenCalled();
      });

      it('should set is reproducing to false', () => {
        organism.update(world);
        expect(organism.isReproducing).toBeFalsy();
      });

      it('should call onReproductionCompleted callback', () => {
        organism.update(world);
        expect(onReproductionCompletedSpy).toHaveBeenCalled();
      });
    });
  });
});
