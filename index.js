// src/index.js
import Fastify from 'fastify';
import { config } from './config/environment.js';
import { webhookRoutes } from './routes/webhooks.js';

const fastify = Fastify({
  logger: true
});

fastify.register(webhookRoutes);

const start = async () => {
  try {
    await fastify.listen({ 
      port: config.server.port,
      host: '0.0.0.0'
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();