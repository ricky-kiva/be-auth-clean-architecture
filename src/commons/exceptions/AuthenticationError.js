'use strict';

const ClientError = require('../exceptions/ClientError');

class AuthenticationError extends ClientError {
  constructor(message) {
    super(message, 401);

    this.name = 'AuthenticationError';
  }
}

module.exports = AuthenticationError;
