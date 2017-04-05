'use strict';

// Inspired from nodejs/github-bot: https://github.com/nodejs/github-bot/blob/master/lib/logger.js

const bunyan = require('bunyan');

const streams = [
    {
        stream: process.stdout,
        level: 'INFO'
    }
];

module.exports = bunyan.createLogger({
    name: 'sdg',
    streams
});
