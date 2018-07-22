'use strict';

Promise
  .resolve(require('./api/app/default-context'))
  .then(require('./api/app/configure-swagger'))
  .then(require('./api/app/start-listening'))
  .catch(require('./api/app/catch-all'));