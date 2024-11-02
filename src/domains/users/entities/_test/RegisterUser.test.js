'use strict';

const RegisterUser = require('../RegisterUser');

describe('a RegisterUser entities', () => {
  it('throws an error when payload properties incomplete', () => {
    const payload = {
      username: 'abc',
      password: 'abc'
    };

    expect(() => new RegisterUser(payload)).toThrow('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('throws an error when payload did not meet the specification', () => {
    const payload = {
      username: 123,
      fullname: true,
      password: 'abc'
    };

    expect(() => new RegisterUser(payload).toThrow('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION'));
  });

  it('throws an error when username contains > 50 characters', () => {
    const payload = {
      username: 'komodoindonesiakomodoindonesiakomodoindonesiakomodo',
      fullname: 'Komodo Indonesia',
      password: 'abc'
    };

    expect(() => new RegisterUser(payload)).toThrow('REGISTER_USER.USERNAME_LIMIT_CHAR');
  });

  it('throws an error when username contains restricted character', () => {
    const payload = {
      username: 'komo do',
      fullname: 'komodo',
      password: 'abc'
    };

    expect(() => new RegisterUser(payload)).toThrow('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER');
  });

  it('creates registerUser object correctly', () => {
    const payload = {
      username: 'komodo',
      fullname: 'Komodo Indonesia',
      password: 'abc'
    };

    const { username, fullname, password } = new RegisterUser(payload);

    expect(username).toEqual(payload.username);
    expect(fullname).toEqual(payload.fullname);
    expect(password).toEqual(payload.password);
  });
});
