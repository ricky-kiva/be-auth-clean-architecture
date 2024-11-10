'use strict';

const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
  translate: (error) => DomainErrorTranslator._directories[error.message] || error
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('unable to create new user. missing property'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('unable to create new user. wrong property data type'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('unable to create new user. username character exceeding limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('unable to create new user. username contains restricted characters')
};

module.exports = DomainErrorTranslator;
