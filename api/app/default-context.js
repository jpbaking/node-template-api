'use strict';

const Express = require('express');

const packageJson = require('../../package.json');

module.exports = {
  basePath: `/${packageJson.alias || packageJson.name}/api`,
  express: {
    app: new Express(),
    host: process.env.HOST || '127.0.0.1',
    port: process.env.PORT ? parseInt(process.env.PORT) : 8080
  },
  swagger: {
    doc: `${__dirname}/../swagger/swagger.yaml`,
    options: {
      controllers: `${__dirname}/../controllers`,
      ignoreMissingHandlers: false,
      useStubs: process.env.NODE_ENV === 'mock' ? true : false
    }
  }
};