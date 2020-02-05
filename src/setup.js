// @flow
import {KontorolPlayer} from './kontorol-player';
import {getPlayerProxy} from './proxy';
import {evaluatePluginsConfig} from './common/plugins/plugins-config';
import {
  applyCastSupport,
  applyStorageSupport,
  attachToFirstClick,
  getDefaultOptions,
  printKontorolPlayerVersionToLog,
  printSetupMessages,
  setLogOptions,
  setStorageConfig,
  setStorageTextStyle,
  supportLegacyOptions,
  validateConfig
} from './common/utils/setup-helpers';

/**
 * Setup the Kontorol Player.
 * @param {PartialKPOptionsObject|LegacyPartialKPOptionsObject} options - partial kontorol player options
 * @private
 * @returns {KontorolPlayer} - The Kontorol Player.
 */
function setup(options: PartialKPOptionsObject | LegacyPartialKPOptionsObject): KontorolPlayer {
  printKontorolPlayerVersionToLog(options);
  options = supportLegacyOptions(options);
  validateConfig(options);
  const defaultOptions = getDefaultOptions(options);
  setLogOptions(defaultOptions);
  printSetupMessages();
  evaluatePluginsConfig(defaultOptions.plugins, defaultOptions);
  setStorageConfig(defaultOptions);
  const player = getPlayerProxy(defaultOptions);
  setStorageTextStyle(player);
  applyStorageSupport(player);
  applyCastSupport(defaultOptions, player);
  attachToFirstClick(player);
  return player;
}

export {setup};
