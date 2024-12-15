'use strict';

const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const AuthenticationTokenManager = require('../../../applications/security/AuthenticationTokenManager');

describe('HTTP server', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  it('should response 404 when requesting to unregistered route', async () => {
    const server = await createServer({});

    const res = await server.inject({
      method: 'GET',
      url: '/unregisteredRoute'
    });

    expect(res.statusCode).toEqual(404);
  });

  describe('when GET /', () => {
    it('should return 200 & hello world', async () => {
      const server = await createServer({});

      const res = await server.inject({
        method: 'GET',
        url: '/'
      });

      const resJson = JSON.parse(res.payload);

      expect(res.statusCode).toEqual(200);
      expect(resJson.value).toEqual('Hello world!');
    });
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
      expect(resJson.message).toEqual('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada');
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
      expect(resJson.message).toEqual('tidak dapat membuat user baru karena tipe data tidak sesuai');
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
      expect(resJson.message).toEqual('tidak dapat membuat user baru karena karakter username melebihi batas limit');
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
      expect(resJson.message).toEqual('tidak dapat membuat user baru karena username mengandung karakter terlarang');
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
  });

  describe('when PUT /authentications', () => {
    it('should return 200 and new access token', async () => {
      // Arrange
      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia'
        }
      });
      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret'
        }
      });
      const { data: { refreshToken } } = JSON.parse(loginResponse.payload);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken
        }
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.accessToken).toBeDefined();
    });

    it('should return 400 payload not contain refresh token', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {}
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('harus mengirimkan token refresh');
    });

    it('should return 400 if refresh token not string', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken: 123
        }
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token harus string');
    });

    it('should return 400 if refresh token not valid', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken: 'invalid_refresh_token'
        }
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token tidak valid');
    });

    it('should return 400 if refresh token not registered in database', async () => {
      // Arrange
      const server = await createServer(container);
      const refreshToken = await container.getInstance(AuthenticationTokenManager.name).createRefreshToken({ username: 'dicoding' });

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken
        }
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token tidak ditemukan di database');
    });
  });

  describe('when DELETE /authentications', () => {
    it('should response 200 if refresh token valid', async () => {
      // Arrange
      const server = await createServer(container);
      const refreshToken = 'refresh_token';
      await AuthenticationsTableTestHelper.addToken(refreshToken);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken
        }
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 400 if refresh token not registered in database', async () => {
      // Arrange
      const server = await createServer(container);
      const refreshToken = 'refresh_token';

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken
        }
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token tidak ditemukan di database');
    });

    it('should response 400 if payload not contain refresh token', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {}
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('harus mengirimkan token refresh');
    });

    it('should response 400 if refresh token not string', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken: 123
        }
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token harus string');
    });
  });

  it('should handle server error correctly', async () => {
    // Arrange
    const requestPayload = {
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
      password: 'super_secret'
    };
    const server = await createServer({}); // fake injection

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(500);
    expect(responseJson.status).toEqual('error');
    expect(responseJson.message).toEqual('internal server error');
  });
});
