'use strict';

const child_process = require('child_process');

const config = require('./config');
const die = require('./die');

const deploymentQueue = [];
let currentDeployment = null;

function deploy(data) {
    const {
        logger,
        repository: {
            full_name: repo
        }
    } = data;

    const repoConfig = getRepoConfig(repo);
    if (!repoConfig) {
        logger.error('Repository not found in the config');
        return;
    }

    if (deploymentQueue.find(d => d.name === repo) !== undefined) {
        logger.info('Existing pending deployment');
        return;
    }

    logger.info('Add deployment to the queue');
    deploymentQueue.push({
        name: repo,
        config: repoConfig,
        logger
    });

    if (currentDeployment === null) {
        flushQueue();
    }
}

async function flushQueue() {
    if (currentDeployment !== null) {
        throw new Error('Unreachable. currentDeployment should be null');
    }
    const toDeploy = deploymentQueue.shift();
    if (toDeploy === undefined) {
        return;
    }

    currentDeployment = executeDeployment(toDeploy);
    try {
        await currentDeployment;
        toDeploy.logger.info('Finished deployment');
    } catch (err) {
        toDeploy.logger.error({err});
    } finally {
        currentDeployment = null;
        flushQueue();
    }
}

async function executeDeployment(toDeploy) {
    toDeploy.logger.info('Start deployment');
    const execInCwd = getExecInCwd(toDeploy.config.cwd);
    await execInCwd('git', ['fetch', 'origin']);
    await execInCwd('git', ['reset', '--hard', 'HEAD']);
    await execInCwd('git', ['checkout', 'origin/deploy']);
    await execInCwd('git', ['clean', '-fd']);
    await execInCwd('yarn', ['install']);
    await execInCwd('yarn', ['run', 'deploy']);
}

function getRepoConfig(repo) {
    return config.find(r => r.name === repo);
}

function getExecInCwd(cwd) {
    return function execInCwd(file, options) {
        return new Promise(function (resolve, reject) {
            child_process.execFile(file, options, {
                cwd
            }, function (err, result) {
                if (err) return reject(err);
                return resolve(result);
            });
        });
    };
}

module.exports = {
    deploy
};
