import { updateLeaderboard } from './leaderboard';

let gameUpdateSnapshot = {};
// let gameStart = 0;
let firstServerTimestamp = 0;

export function initState() {
  // gameStart = 0;
  firstServerTimestamp = 0;
}

export function processGameUpdate(update) {
  if (!firstServerTimestamp) {
    firstServerTimestamp = update.t;
    // gameStart = Date.now();
  }
  gameUpdateSnapshot = update;
  updateLeaderboard(update.leaderboard);
}

// function currentServerTime() {
//   return firstServerTimestamp + (Date.now() - gameStart);
// }

// Returns { me, others }
export function getCurrentState() {
  if (!firstServerTimestamp) {
    return {};
  }

  return gameUpdateSnapshot;
}
