'use strict';

const AddUserUseCase = require('../../../../applications/use_case/AddUserUseCase');

class UsersHandler {
  constructor(container) {
    this._container = container;
    this.postUser = this.postUser.bind(this);
  }

  async postUser(req, h) {
    const addUserUseCase = this._container.getInstance(AddUserUseCase.name);
    const addedUser = await addUserUseCase.execute(req.payload);

    const res = h.response({
      status: 'success',
      data: { addedUser }
    });

    res.code(201);

    return res;
  }
}

module.exports = UsersHandler;
