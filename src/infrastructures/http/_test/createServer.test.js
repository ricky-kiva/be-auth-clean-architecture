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

  it('should response 400 when payload does not contain needed property', async () => {
    const reqPayload = {
      fullname: 'Komodo Indonesia',
      password: 'secret'
    };

    const server = await createServer(container);

    const res = await server.inject({
      method: 'POST',
      url: '/users',
      payload: reqPayload
    });

    const resJson = JSON.parse(res.payload);

    expect(res.statusCode).toEqual(400);
    expect(resJson.status).toEqual('fail');
    expect(resJson.message).toEqual('unable to create new user. missing property');
  });

  it('should response 400 when payload does not meet data type spec.', async () => {
    const reqPayload = {
      username: 'komodo',
      password: 'secret',
      fullname: ['Komodo Indonesia']
    };

    const server = await createServer(container);

    const res = await server.inject({
      method: 'POST',
      url: '/users',
      payload: reqPayload
    });

    const resJson = JSON.parse(res.payload);

    expect(res.statusCode).toEqual(400);
    expect(resJson.status).toEqual('fail');
    expect(resJson.message).toEqual('unable to create new user. wrong property data type');
  });

  it('should response 400 when username > 30 char.', async () => {
    const reqPayload = {
      username: 'komodoindonesiakomodoindonesiakomodoindonesiakomodoindonesiakomodoindonesiakomodoindonesiakomodoindonesiakomodoindonesiakomodoindonesiakomodoindonesiakomodoindonesia',
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

    expect(res.statusCode).toEqual(400);
    expect(resJson.status).toEqual('fail');
    expect(resJson.message).toEqual('unable to create new user. username character exceeding limit');
  });

  it('should response 400 when username contains restricted character', async () => {
    const reqPayload = {
      username: 'komodo indonesia',
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

    expect(res.statusCode).toEqual(400);
    expect(resJson.status).toEqual('fail');
    expect(resJson.message).toEqual('unable to create new user. username contains restricted characters');
  });

  it('should response 400 when username is unavailable', async () => {
    await UsersTableTestHelper.addUser({ username: 'komodo' });

    const requestPayload = {
      username: 'komodo',
      fullname: 'Komodo Indonesia',
      password: 'super_secret'
    };

    const server = await createServer(container);

    const res = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload
    });

    const resJson = JSON.parse(res.payload);

    expect(res.statusCode).toEqual(400);
    expect(resJson.status).toEqual('fail');
    expect(resJson.message).toEqual('username is taken');
  });

  it('should handle server error correctly', async () => {
    const reqPayload = {
      username: 'komodo',
      password: 'Komodo Indonesia',
      fullname: 'secret'
    };

    const server = await createServer({});

    const res = await server.inject({
      method: 'POST',
      url: '/users',
      payload: reqPayload
    });

    const resJson = JSON.parse(res.payload);

    expect(res.statusCode).toEqual(500);
    expect(resJson.status).toEqual('error');
    expect(resJson.message).toEqual('internal server error');
  });

  it('should response 404 when requesting to unregistered route', async () => {
    const server = await createServer({});

    const res = await server.inject({
      method: 'GET',
      url: '/unregisteredRoute'
    });

    expect(res.statusCode).toEqual(404);
  });
});
