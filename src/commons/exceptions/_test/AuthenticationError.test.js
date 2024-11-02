'use strict';

const AuthenticationError = require('../AuthenticationError');

describe('AuthenticationError', () => {
  it('should create a correct error', () => {
    const authError = new AuthenticationError('authentication error occured');

    expect(authError.statusCode).toEqual(401);
    expect(authError.message).toEqual('authentication error occured');
    expect(authError.name).toEqual('AuthenticationError');
  });
});
