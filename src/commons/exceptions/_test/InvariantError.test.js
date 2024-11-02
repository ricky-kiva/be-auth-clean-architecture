'use strict';

const InvariantError = require('../InvariantError');

describe('InvariantError', () => {
  it('should create a correct error', () => {
    const invariantError = new InvariantError('an error occured');

    expect(invariantError.statusCode).toEqual(400);
    expect(invariantError.message).toEqual('an error occured');
    expect(invariantError.name).toEqual('InvariantError');
  });
});
