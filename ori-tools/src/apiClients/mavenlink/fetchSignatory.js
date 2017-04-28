/* eslint-disable no-underscore-dangle */
const fetch = require('node-fetch');

// Returns a "signed" fetch function by applying the appropriate OAuth headers
module.exports = function fetchSignatory(bearerToken) {
  return function(url, config) {
    config.headers = config.headers || {};
    config = Object.assign({}, config, {
      headers: Object.assign({}, config.headers, {
        Authorization: `Bearer ${bearerToken}`
      })
    });
    return fetch(url, config);
  };
};
