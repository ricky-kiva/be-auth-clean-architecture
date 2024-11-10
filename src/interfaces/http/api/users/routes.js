'use strict';

const routes = (h) => ([
  {
    method: 'POST',
    path: '/users',
    handler: h.postUser
  }
]);

module.exports = routes;
