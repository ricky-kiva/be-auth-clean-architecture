'use strict';

const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('HTTP server', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /users', () => {
    it('should response 201 & persisted user', async () => {
      const reqPayload = {
        username: 'komodo',
        password: 'secret',
        fullname: 'Komodo Indonesia'
      };

      const server = await createServer(container);

      const res = await server.inject({
        method: 'POST',
        url: '/users',
        payload: reqPayload
      });

      const resJson = JSON.parse(res.payload);

      expect(res.statusCode).toEqual(201);
      expect(resJson.status).toEqual('success');
      expect(resJson.data.addedUser).toBeDefined();
    });
  });
});
