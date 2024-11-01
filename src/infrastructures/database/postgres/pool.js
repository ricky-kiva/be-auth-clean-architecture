/* istanbul ignore file */

'use strict';

const { Pool } = require('pg');
const config = require('../../../commons/config');

const pool = new Pool(config.database);

module.exports = pool;
