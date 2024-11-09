'use strict';

const RegisteredUser = require('../RegisteredUser');

describe('a RegisteredUser entities', () => {
  it('throws an error when payload have incomplete properties', () => {
    const payload = {
      username: 'komodo',
      fullname: 'Komodo Indonesia'
    };

    expect(() => new RegisteredUser(payload)).toThrow('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('throws an error when payload did not meet specification', () => {
    const payload = {
      id: 123,
      username: 'komodo',
      fullname: 'Komodo Indonesia'
    };

    expect(() => new RegisteredUser(payload)).toThrow('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('creates registeredUser object correctly', () => {
    const payload = {
      id: 'user-123',
      username: 'komodo',
      fullname: 'Komodo Indonesia'
    };

    const registeredUser = new RegisteredUser(payload);

    expect(registeredUser.id).toEqual(payload.id);
    expect(registeredUser.username).toEqual(payload.username);
    expect(registeredUser.fullname).toEqual(payload.fullname);
  });
});
