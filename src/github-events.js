'use strict';

const EventEmitter = require('events');

const deployer = require('./deployer');

const emitter = new EventEmitter();

emitter.on('push', function (data) {
    if (data.ref !== 'refs/heads/deploy') {
        data.logger.info('Branch is not "deploy", ignoring push event');
    } else {
        deployer.deploy(data);
    }
});

module.exports = emitter;
