'use strict';

const defaultContext = require('./default-context');

module.exports = (context = defaultContext) => {

  // Start the server
  context.express.app.listen(context.express.port, context.express.host);
  console.log('Started : http://%s:%s%s', context.express.host, context.express.port, context.basePath);
  return context;
};