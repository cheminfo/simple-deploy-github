'use strict';

const GitHubApi = require('@octokit/rest');

const token = process.env.GITHUB_TOKEN || 'token';

const githubApi = new GitHubApi({
  protocol: 'https',
  headers: {
    'user-agent': 'Simple-Deploy-GitHub'
  }
});

githubApi.authenticate({
  type: 'oauth',
  token
});

module.exports = githubApi;
