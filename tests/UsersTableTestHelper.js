/* istanbul ignore file */

'use strict';

const pool = require('../src/infrastructures/database/postgres/pool');

const UsersTableTestHelper = {
  async addUser({
    id = 'user-123',
    username = 'rickyslash',
    password = 'secret',
    fullname = 'Rickyslash'
  }) {
    const q = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4)',
      values: [id, username, password, fullname]
    };

    await pool.query(q);
  },
  async findUsersById(id) {
    const q = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id]
    };

    const result = await pool.query(q);

    return result.rows;
  },
  async cleanTable() {
    await pool.query('TRUNCATE TABLE users');
  }
};

module.exports = UsersTableTestHelper;
