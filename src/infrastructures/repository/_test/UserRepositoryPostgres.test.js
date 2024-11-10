'use strict';

const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../commons/exceptions/InvariantError');
const RegisterUser = require('../../../domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../domains/users/entities/RegisteredUser');
const pool = require('../../database/postgres/pool');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailableUsername function', () => {
    it('throws an InvariantError when username not available', async () => {
      await UsersTableTestHelper.addUser({ username: 'komodo' });

      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      await expect(userRepositoryPostgres.verifyAvailableUsername('komodo'))
        .rejects.toThrow(InvariantError);
    });

    it('does not throws an InvariantError when user when username is available', async () => {
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      await expect(userRepositoryPostgres.verifyAvailableUsername('komodo'))
        .resolves.not.toThrow(InvariantError);
    });
  });

  describe('addUser function', () => {
    it('should persist register user', async () => {
      const registerUser = new RegisterUser({
        username: 'komodo',
        password: 'secret_password',
        fullname: 'Komodo Indonesia'
      });

      const idNumber = '123';
      const fakeIdGenerator = () => idNumber;

      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      await userRepositoryPostgres.addUser(registerUser);

      const users = await UsersTableTestHelper.findUsersById(`user-${idNumber}`);

      expect(users).toHaveLength(1);
    });

    it('should return registered user correctly', async () => {
      const registerUser = new RegisterUser({
        username: 'komodo',
        password: 'secret',
        fullname: 'Komodo Indonesia'
      });

      const idNumber = '123';
      const fakeIdGenerator = () => idNumber;

      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      const registeredUser = await userRepositoryPostgres.addUser(registerUser);

      expect(registeredUser).toStrictEqual(new RegisteredUser({
        id: `user-${idNumber}`,
        username: registerUser.username,
        fullname: registerUser.fullname
      }));
    });
  });
});
