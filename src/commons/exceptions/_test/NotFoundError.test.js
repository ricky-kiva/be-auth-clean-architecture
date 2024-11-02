'use strict';

const NotFoundError = require('../NotFoundError');

describe('NotFoundError', () => {
  it('should create a correct error', () => {
    const notFoundError = new NotFoundError('not found error occured');

    expect(notFoundError.message).toEqual('not found error occured');
    expect(notFoundError.statusCode).toEqual(404);
    expect(notFoundError.name).toEqual('NotFoundError');
  });
});

module.exports = NotFoundError;
