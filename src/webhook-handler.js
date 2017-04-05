'use strict';

const crypto = require('crypto');
const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET || 'a secret';

const githubEvents = require('./github-events');
const logger = require('./logger');

async function webhookHandler(ctx, next) {
    if (ctx.method === 'POST' && ctx.path === '/webhook_handler') {
        const event = ctx.headers['x-github-event'];
        if (!event) {
            ctx.status = 400;
            ctx.body = 'Event header not found';
            return;
        }

        if (!isValid(ctx.request)) {
            ctx.status = 401;
            ctx.body = 'Invalid signature';
            return;
        }

        ctx.status = 200;

        if (event === 'ping') {
            logger.info('Received ping event');
            return;
        }

        const data = ctx.request.body

        data.logger = logger.child({
            event,
            delivery: ctx.headers['x-github-delivery'],
            repo: data.repository.full_name
        });

        data.logger.info('Received event');
        githubEvents.emit(event, data);
    } else {
        await next();
    }
}

function isValid(request) {
    const signature = request.headers['x-hub-signature'];
    const data = request.rawBody;
    const buffer = Buffer.from(data, 'utf8');
    const signed = 'sha1=' + crypto.createHmac('sha1', webhookSecret).update(buffer).digest('hex');
    return signature === signed;
}

module.exports = webhookHandler;
