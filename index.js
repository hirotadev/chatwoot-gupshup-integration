// src/index.js
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { config } from './src/config/environment.js';
import { webhookRoutes } from './src/routes/webhooks.js';

const fastify = Fastify({
  logger: true
});

fastify.register(cors, webhookRoutes);

const start = async () => {
  try {
    fastify.listen({ 
      port: config.server.port,
      host: '0.0.0.0'
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();