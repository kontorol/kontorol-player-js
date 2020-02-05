import {KontorolPlayer} from '../../src/kontorol-player';

/**
 * @type {Object.<string, KontorolPlayer>}
 * @name KontorolPlayers
 * @description a map of player instances by player ids
*/
type _KontorolPlayers = {[id: string]: KontorolPlayer};
declare type KontorolPlayers = _KontorolPlayers;
