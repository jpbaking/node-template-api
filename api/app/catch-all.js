'use strict';

module.exports = error => {
  console.error('Failed to launch app.\n    | %s', (error.stack || error).replace(/\n/g, '\n    | '));
};