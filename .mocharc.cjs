'use strict';

module.exports = {
  recursive: true,
  colors: true,
  exclude: [
    // Run via test_raidboss_data.js.
    'test/helper/*',
  ],
  require: ['ts-node/register'],
  extension: [
    '.js',
    '.cjs',
    '.mjs',
    '.ts',
    '.d.ts',
  ],
};
