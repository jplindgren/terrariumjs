const Constants = require('../shared/constants');
const Player = require('./player');
const World = require('./world');

class Game {
  constructor() {
    this.sockets = {};
    this.lastUpdateTime = Date.now();
    this.shouldSendUpdate = false;
    setInterval(this.run.bind(this), 1000 / Constants.SPEED_PER_MINUTE);
    this.tick = 0;
    this.world = new World();
  }

  addPlayer(socket, username) {
    this.sockets[socket.id] = socket;

    // Generate a position to start this player at.
    const x = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5); // generate deviation 25% to 75% from mapsize
    const y = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5); // generate deviation 25% to 75% from mapsize

    this.world.addPlayer(new Player(socket.id, username, x, y));
  }

  removePlayer(socket) {
    delete this.sockets[socket.id];
    this.world.removePlayer(socket.id);
  }

  // temp remove until fix it
  // eslint-disable-next-line no-unused-vars
  handleInput(socket, dir) {
    if (this.world.players[socket.id]) {
      // this.world.players[socket.id].setDirection(dir);
      // this.world.players[socket.id].update(0.05);
    }
  }

  // just for test, cannot change it in multiplayer?
  handleChangeSpeed(speed) {
    this.world.tickYearRatio = Math.min(Constants.TICKER_YEAR_RATIO, this.world.tickYearRatio + speed);
    console.log('new ratio: ', this.world.tickYearRatio);
  }

  static writeLog(...args) {
    if (process.env.NODE_ENV === 'development' && 1 === 2) console.log(...args);
  }

  run() {
    // Calculate time elapsed
    const now = Date.now();
    const dt = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    if (!this.world.hasLife()) return;

    this.tick++;
    this.world.updateState(this.tick, dt);

    // Send a game update to each player every other time
    if (this.shouldSendUpdate) {
      const leaderboard = this.getLeaderboard();
      Object.keys(this.sockets).forEach(playerID => {
        const socket = this.sockets[playerID];
        const player = this.world.players[playerID];

        // TODO: in future we can save the playerid in all
        // hierarchy of organisms and have a shortcut to cicly between them.
        // const organism = this.organisms.filter((o) => o.id == playerID)[0];
        if (player) socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player, leaderboard));
      });
      this.shouldSendUpdate = false;
    } else {
      this.shouldSendUpdate = true;
    }

    Game.writeLog('Ending Update tick!!', this.tick);
  }

  getLeaderboard() {
    return this.world.organisms.slice(0, 10)
      .map(o => ({ username: `${o.constructor.name}#${o.id}`, score: o.current.age }));
  }

  createUpdate(me, leaderboard) {
    // TODO: When we have bigger map, we need nearby
    /* const nearbyOrganisms = this.organisms.filter(
      (o) => o !== organism && o.distanceTo(organism) <= Constants.MAP_SIZE / 2,
    ); */
    return {
      t: Date.now(),
      me: me.serializeForUpdate(),
      others: this.world.organisms.map(p => p.serializeForUpdate()),
      leaderboard,
    };
  }
}

module.exports = Game;
