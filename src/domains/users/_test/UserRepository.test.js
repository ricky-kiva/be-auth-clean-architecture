'use strict';

const UserRepository = require('../UserRepository');

describe('UserRepository interface', () => {
  it('throws error when invoking abstract behavior', async () => {
    const userRepository = new UserRepository();

    await expect(userRepository.addUser({}))
      .rejects.toThrow('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(userRepository.verifyAvailableUsername(''))
      .rejects.toThrow('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(userRepository.getPasswordByUsername(''))
      .rejects.toThrow('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
