/* eslint-disable no-underscore-dangle */
const fetch = require('node-fetch');

// Returns a "signed" fetch function by applying the appropriate OAuth headers
module.exports = function fetchSignatory(oa, token, secret) {
  return function(url, config) {
    config.headers = config.headers || {};
    const params = oa._prepareParameters(
      token,
      secret,
      config.method || 'GET',
      url,
      {}
    );
    const signature = oa._buildAuthorizationHeaders(params);
    let authHeader = 'Authorization';
    if (oa._isEcho) {
      authHeader = 'X-Verify-Credentials-Authorization';
    }
    config = Object.assign({}, config, {
      headers: Object.assign({}, config.headers, {
        [authHeader]: signature
      })
    });
    return fetch(url, config);
  };
};
