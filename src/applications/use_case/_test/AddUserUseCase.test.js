'use strict';

const RegisterUser = require('../../../domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../domains/users/entities/RegisteredUser');
const UserRepository = require('../../../domains/users/UserRepository');
const PasswordHash = require('../../security/PasswordHash');
const AddUserUseCase = require('../AddUserUseCase');

describe('AddUserUseCase', () => {
  it('should orcestrace the Add User action correctly', async () => {
    const useCasePayload = {
      username: 'komodo',
      password: 'secret',
      fullname: 'Komodo Indonesia'
    };

    const userId = 'user-123';

    const mockRegisteredUser = new RegisteredUser({
      id: userId,
      username: useCasePayload.username,
      fullname: useCasePayload.fullname
    });

    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();

    mockUserRepository.verifyAvailableUsername = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const passwordHashResult = 'encrypted_Password';

    mockPasswordHash.hash = jest.fn()
      .mockImplementation(() => Promise.resolve(passwordHashResult));

    mockUserRepository.addUser = jest.fn()
      .mockImplementation(() => Promise.resolve(mockRegisteredUser));

    const getUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash
    });

    const registeredUser = await getUserUseCase.execute(useCasePayload);

    expect(registeredUser).toStrictEqual(new RegisteredUser({
      id: userId,
      username: useCasePayload.username,
      fullname: useCasePayload.fullname
    }));

    expect(mockUserRepository.verifyAvailableUsername)
      .toHaveBeenCalledWith(useCasePayload.username);

    expect(mockPasswordHash.hash)
      .toHaveBeenCalledWith(useCasePayload.password);

    expect(mockUserRepository.addUser)
      .toHaveBeenCalledWith(new RegisterUser({
        username: useCasePayload.username,
        password: passwordHashResult,
        fullname: useCasePayload.fullname
      }));
  });
});
