'use strict';

require('dotenv').config();

const createServer = require('./infrastructures/http/createServer');
const container = require('./infrastructures/container');

const start = async () => {
  const server = await createServer(container);

  await server.start();

  // eslint-disable-next-line no-console
  console.log(`Server is starting at ${server.info.uri}`);
};

start();
