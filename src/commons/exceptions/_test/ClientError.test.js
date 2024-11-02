'use strict';

const ClientError = require('../ClientError');

describe('ClientError', () => {
  it('should throw error when instantiated', () => {
    expect(() => new ClientError('')).toThrow('cannot instantiate abstract class');
  });
});
