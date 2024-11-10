'use strict';

const bcrypt = require('bcrypt');
const BcryptPasswordHash = require('../BcryptPasswordHash');

describe('BcryptPasswordHash', () => {
  describe('hash function', () => {
    it('should encrypt password correctly', async () => {
      const spyHash = jest.spyOn(bcrypt, 'hash');
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      const nonEncryptedPassword = 'plain_password';

      const encryptedPassword = await bcryptPasswordHash.hash(nonEncryptedPassword);

      expect(typeof encryptedPassword).toEqual('string');
      expect(encryptedPassword).not.toEqual(nonEncryptedPassword);
      expect(spyHash).toHaveBeenCalledWith(nonEncryptedPassword, 10);
    });
  });
});
