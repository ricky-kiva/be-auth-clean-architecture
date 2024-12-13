'use strict';

const InvariantError = require('../../commons/exceptions/InvariantError');
const RegisteredUser = require('../../domains/users/entities/RegisteredUser');
const UserRepository = require('../../domains/users/UserRepository');

class UserRepositoryPostgres extends UserRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyAvailableUsername(username) {
    const q = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username]
    };

    const result = await this._pool.query(q);

    if (result.rowCount) {
      throw new InvariantError('username is taken');
    }
  }

  async addUser(registerUser) {
    const { username, password, fullname } = registerUser;
    const id = `user-${this._idGenerator()}`;

    const q = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id, username, fullname',
      values: [id, username, password, fullname]
    };

    const result = await this._pool.query(q);

    return new RegisteredUser({ ...result.rows[0] });
  }

  async getPasswordByUsername(username) {
    const query = {
      text: 'SELECT password FROM users WHERE username = $1',
      values: [username]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('username tidak ditemukan');
    }

    return result.rows[0].password;
  }
}

module.exports = UserRepositoryPostgres;
