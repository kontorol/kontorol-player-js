// @flow
import {KontorolPlayer} from './kontorol-player';
import {FakeEventTarget} from '@pakhshkit-js/pakhshkit-js';

const Players: KontorolPlayers = {};
/**
 * get all instantiated players
 * @returns {KontorolPlayers} - map of player ids and their respective instantiated player
 */
function getPlayers(): KontorolPlayers {
  return Players;
}

/**
 * get a player instance by id
 * @param {string} id - the player ID
 * @returns {KontorolPlayer | null} - the player if found by the supplied ID or null if key doesn't exist
 */
function getPlayer(id: string): ?KontorolPlayer {
  if (Players[id]) {
    return Players[id];
  }
  return null;
}

const proxyIgnoredProps: Array<string> = ['_remotePlayer', '_listeners', '_uiWrapper'];
const proxyHandler: Object = {
  get(kp: KontorolPlayer, prop: string) {
    if (prop === 'destroy') {
      const playerId = kp.config.targetId;
      delete Players[playerId];
    }

    if (prop in FakeEventTarget.prototype || proxyIgnoredProps.includes(prop)) {
      // $FlowFixMe
      return kp[prop];
    }
    if (kp._remotePlayer && prop in kp._remotePlayer) {
      return kp._remotePlayer[prop];
    }
    // $FlowFixMe
    return kp[prop];
  },
  set(kp: KontorolPlayer, prop: string, value: any) {
    if (kp._remotePlayer && !proxyIgnoredProps.includes(prop)) {
      if (prop in kp._remotePlayer) {
        kp._remotePlayer[prop] = value;
      }
    } else {
      // $FlowFixMe
      kp[prop] = value;
    }
    return true;
  }
};

const getPlayerProxy = (options: KPOptionsObject) => {
  const player = new KontorolPlayer(options);
  const proxy = new Proxy(player, proxyHandler);
  Players[options.targetId] = proxy;
  return proxy;
};

export {getPlayerProxy, getPlayer, getPlayers};
