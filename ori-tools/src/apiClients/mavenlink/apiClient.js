const env = require('../../env');
const getOauthToken = require('./getOauthToken');
const fetchSignatory = require('./fetchSignatory');
const responseHandler = require('../responseHandler');
const serializeFormData = require('../serializeFormData');

const DefaultHeaders = {
  contentType: 'application/json'
};

/*
 * Returns an Api Client that automatically signs each request with the
 * appropriate keys, automatically returns JSON data where appropriate, and
 * processes errors from the response body.
*/
module.exports = function apiClient(event, accessToken, secret) {
  let signedFetch = getOauthToken().then(bearerToken =>
    fetchSignatory(bearerToken));

  /*
   * Convenience method for binding a signed fetch request to a particular HTTP
   * method with automatic hostname appending, default headers, and response
   * handling.
   */
  function methodRequest(method) {
    return (uri, headers, body) => {
      const init = {
        body,
        headers: Object.assign({}, DefaultHeaders, headers),
        method
      };
      const url = env.get('mavenlinkApiHostName') + uri;
      return signedFetch.then(fetch => fetch(url, init)).then(responseHandler);
    };
  }

  /*
   * Builds a POST/PUT request that serializes form data and applies default
   * headers
   */
  function withForm(requestFn) {
    return (uri, data, headers) => {
      const body = serializeFormData(data);
      headers = Object.assign(
        {
          contentType: 'application/x-www-form-urlencoded'
        },
        headers
      );
      return requestFn(uri, headers, body);
    };
  }
  return {
    get: methodRequest('GET'),
    post: withForm(methodRequest('POST'))
  };
};
