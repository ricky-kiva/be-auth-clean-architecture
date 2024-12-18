'use strict';

const Hapi = require('@hapi/hapi');
const users = require('../../interfaces/http/api/users');
const authentications = require('../../interfaces/http/api/authentications');
const config = require('../../commons/config');
const DomainErrorTranslator = require('../../commons/exceptions/DomainErrorTranslator');
const ClientError = require('../../commons/exceptions/ClientError');

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
    },
    {
      plugin: authentications,
      options: { container }
    }
  ]);

  server.route({
    method: 'GET',
    path: '/',
    handler: () => ({
      value: 'Shine on you crazy diamond!'
    })
  });

  server.ext('onPreResponse', (req, h) => {
    const { response } = req;

    if (response instanceof Error) {
      const translatedError = DomainErrorTranslator.translate(response);

      if (translatedError instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: translatedError.message
        });

        newResponse.code(translatedError.statusCode);

        return newResponse;
      }

      if (!translatedError.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status: 'error',
        message: 'internal server error'
      });

      newResponse.code(500);

      return newResponse;
    }

    return h.continue;
  });

  return server;
};

module.exports = createServer;
