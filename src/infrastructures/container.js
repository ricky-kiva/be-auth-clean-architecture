/* istanbul ignore file */

'use strict';

const { createContainer } = require('instances-container');

const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');

const pool = require('./database/postgres/pool');
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');
const BcryptPasswordHash = require('./security/BcryptPasswordHash');

const AddUserUseCase = require('../applications/use_case/AddUserUseCase');
const PasswordHash = require('../applications/security/PasswordHash');

const UserRepository = require('../domains/users/UserRepository');

const container = createContainer();

container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        { concrete: pool },
        { concrete: nanoid }
      ]
    }
  }, {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        { concrete: bcrypt }
      ]
    }
  }
]);

container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name
        }, {
          name: 'passwordHash',
          internal: PasswordHash.name
        }
      ]
    }
  }
]);

module.exports = container;
