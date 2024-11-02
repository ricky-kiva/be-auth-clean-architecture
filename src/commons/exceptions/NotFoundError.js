'use strict';

const ClientError = require('../exceptions/ClientError');

class NotFoundError extends ClientError {
  constructor(message) {
    super(message, 404);

    this.name = 'NotFoundError';
  }
}

module.exports = NotFoundError;
