'use strict';

const swagger = require('swagger-tools').initializeMiddleware;

const path = require('path');
const YAML = require('yamljs');

const packageJson = require('../../package.json');
const defaultContext = require('./default-context');

module.exports = (context = defaultContext) => Promise.resolve(context)
  .then((context = defaultContext) => {
    const extension = path.extname(context.swagger.doc.toLocaleLowerCase());
    if ('.yaml' === extension) {
      context.swagger.doc = YAML.load(context.swagger.doc);
    } else if ('.json' === extension) {
      context.swagger.doc = require(context.swagger.doc);
    } else {
      throw new Error(`Unsupported swagger document file extension: ${extension}`);
    }
    context.swagger.doc.info = {
      title: packageJson.name,
      version: packageJson.version
    };
    context.swagger.doc.host = `${context.express.host}:${context.express.port}`;
    context.swagger.doc.basePath = context.basePath;
    context.swagger.doc.consumes = context.swagger.doc.produces = ["application/json"];
    return context;
  })
  .then(context => new Promise((resolve) => {
    swagger(context.swagger.doc, function (middleware) {
      context.express.app.use(middleware.swaggerMetadata());
      context.express.app.use(middleware.swaggerValidator({ validateResponse: false }));
      context.express.app.use(middleware.swaggerRouter(context.swagger.options));
      context.express.app.use(middleware.swaggerUi({
        apiDocs: `${context.basePath}/swagger`,
        swaggerUi: `${context.basePath}/swagger-ui`
      }));
      const redirector = (_, res) => { res.redirect(`${context.basePath}/swagger-ui`); };
      let path = '';
      context.basePath.split('/').forEach((subPath) => {
        path = `${path}${path.endsWith('/') ? '' : '/'}${subPath}`;
        context.express.app.get(path, redirector);
      });
      resolve(context);
    });
  }));