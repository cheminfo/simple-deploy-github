'use strict';

const logger = require('./logger');

process.on('unhandledRejection', function (err) {
    die(logger, 'unhandledRejection', err);
});

function die(logger, type, err) {
    logger.fatal({
        type,
        err
    });
    process.exit(1);
}

module.exports = die;
