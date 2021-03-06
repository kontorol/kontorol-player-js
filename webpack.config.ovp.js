'use strict';

const webpack = require('webpack');
const path = require('path');
const packageData = require('./package.json');
const CopyPlugin = require('copy-webpack-plugin');
const webpackConfig = require('./webpack.config');
const PROD = process.env.NODE_ENV === 'production';
const playerType = 'ovp';
const configDocsUrl = 'https://github.com/kontorol/kontorol-player-js/blob/master/docs/configuration.md';

const plugins = [
  new webpack.DefinePlugin({
    __VERSION__: JSON.stringify(packageData.version),
    __NAME__: JSON.stringify(packageData.name),
    __PACKAGE_URL__: JSON.stringify(packageData.repository.url),
    __PLAYER_TYPE__: JSON.stringify(playerType),
    __CONFIG_DOCS_URL__: JSON.stringify(configDocsUrl)
  })
];

if (PROD) {
  plugins.push(new webpack.optimize.UglifyJsPlugin({sourceMap: true}));
} else {
  plugins.push(
    new CopyPlugin([
      {
        from: '../samples/style.css',
        to: '.'
      }
    ])
  );
}

const entry = {
  'kontorol-ovp-player': 'index.js'
};

const alias = {
  'pakhshkit-js-providers': path.resolve('./node_modules/pakhshkit-js-providers/dist/pakhshkit-ovp-provider'),
  'pakhshkit-js-analytics': path.resolve('./src/ovp/analytics'),
  'player-defaults': path.resolve('./src/ovp/player-defaults'),
  poster: path.resolve('./src/ovp/poster')
};

Object.assign(webpackConfig.resolve.alias, alias);

webpackConfig.entry = entry;
webpackConfig.plugins = plugins;

module.exports = webpackConfig;
