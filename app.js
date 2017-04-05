'use strict';

require('dotenv').config();

const Koa = require('koa');
const koaBody = require('koa-bodyparser');
const koaBunyan = require('koa-bunyan');

const logger = require('./src/logger');
const webhookHandler = require('./src/webhook-handler');

const app = new Koa();

app.use(koaBunyan(logger, {
    level: 'debug'
}));
app.use(koaBody());
app.use(webhookHandler);

module.exports = app;
