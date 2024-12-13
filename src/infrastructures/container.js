/* istanbul ignore file */

'use strict';

const { createContainer } = require('instances-container');

const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');

const pool = require('./database/postgres/pool');
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');
const BcryptPasswordHash = require('./security/BcryptPasswordHash');
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres');
const JwtTokenManager = require('./security/JwtTokenManager');

const AddUserUseCase = require('../applications/use_case/AddUserUseCase');
const PasswordHash = require('../applications/security/PasswordHash');
const AuthenticationTokenManager = require('../applications/security/AuthenticationTokenManager');
const LoginUserUseCase = require('../applications/use_case/LoginUserUseCase');
const LogoutUserUseCase = require('../applications/use_case/LogoutUserUseCase');
const RefreshAuthenticationUseCase = require('../applications/use_case/RefreshAuthenticationUseCase');

const UserRepository = require('../domains/users/UserRepository');
const AuthenticationRepository = require('../domains/authentications/AuthenticationRepository');

const container = createContainer();

container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        },
        {
          concrete: nanoid
        }
      ]
    }
  },
  {
    key: AuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        }
      ]
    }
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt
        }
      ]
    }
  },
  {
    key: AuthenticationTokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        {
          concrete: Jwt.token
        }
      ]
    }
  }
]);

// registering use cases
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
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name
        }
      ]
    }
  },
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name
        },
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name
        }
      ]
    }
  },
  {
    key: LogoutUserUseCase.name,
    Class: LogoutUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name
        }
      ]
    }
  },
  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name
        }
      ]
    }
  }
]);

module.exports = container;
