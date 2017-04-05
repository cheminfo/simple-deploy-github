'use strict';

const config = require('../config.json');
if (!Array.isArray(config)) {
    throw new TypeError('config must be an array');
}

function deploy(data) {
    const {
        logger,
        repository: {
            full_name: repo
        }
    } = data;

    const repoConfig = getRepoConfig(repo);
    if (!repoConfig) {
        logger.error('Repository %s not found in the config', repo);
        return;
    }

    // TODO continue deploy script
}

function getRepoConfig(repo) {
    return config.find(r => r.name === repo);
}

module.exports = {
    deploy
};
