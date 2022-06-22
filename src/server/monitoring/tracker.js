class Tracker {
  constructor(specification, actions) {
    this.specification = specification;
    this.actions = actions;
    this.tick = 0;
  }

  tryAddTacker(organism) {
    if (this.specification(organism)) {
      for (let i = 0; i < this.actions.length; i++) {
        const element = this.actions[i];
        if (typeof organism[element] === 'function') {
          // eslint-disable-next-line no-param-reassign
          organism[element] = Tracker.decorate(organism[element]);
        }
      }
    }
  }

  static decorate(originalFunc) {
    // eslint-disable-next-line func-names
    return function (...args) {
      const start = new Date();
      const returnVal = originalFunc.apply(this, args);
      const end = new Date();
      const duration = end.getTime() - start.getTime();

      const m = `TICK: ${this.tick}: ${originalFunc.name}
        took ${duration} ms to execute. Called with parameters: ${args}`;
      console.dir(m, { depth: null });
      return returnVal;
    };
  }
}

module.exports = Tracker;
