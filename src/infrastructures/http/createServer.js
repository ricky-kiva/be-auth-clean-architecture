'use strict';

const Hapi = require('@hapi/hapi');
const users = require('../../interfaces/http/api/users');
const config = require('../../commons/config');

const createServer = async (container) => {
  const server = Hapi.server({
    host: config.app.host,
    port: config.app.port,
    debug: config.app.debug
  });

  await server.register([
    {
      plugin: users,
      options: { container }
    }
  ]);

  return server;
};

module.exports = createServer;
