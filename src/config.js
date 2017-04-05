'use strict';

const config = require('../config.json');

if (!Array.isArray(config)) {
    throw new TypeError('config must be an array');
}

for (const element of config) {
    if (!element.name || !element.cwd) {
        throw new Error('config elements must have name and cwd');
    }
}

module.exports = config;
