/* istanbul ignore file */

'use strict';

const pool = require('../src/infrastructures/database/postgres/pool');

const AuthenticationsTableTestHelper = {
  async addToken(token) {
    const q = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token]
    };

    await pool.query(q);
  },
  async findToken(token) {
    const q = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token]
    };

    const result = await pool.query(q);

    return result.rows;
  },
  async cleanTable() {
    await pool.query('TRUNCATE TABLE authentications');
  }
};

module.exports = AuthenticationsTableTestHelper;
