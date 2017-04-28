const env = require('../../env');
const getOauthToken = require('./getOauthToken');
const fetchSignatory = require('./fetchSignatory');
const responseHandler = require('../responseHandler');
const serializeFormData = require('../serializeFormData');

const DefaultHeaders = {
  contentType: 'application/json'
};
const DefaultMethod = 'GET';

/*
 * Returns an Api Client that automatically signs each request with the
 * appropriate keys, automatically returns JSON data where appropriate, and
 * processes errors from the response body.
*/
module.exports = function apiClient(event, accessToken, secret) {
  let signedFetch = getOauthToken().then(bearerToken =>
    fetchSignatory(bearerToken));

  /*
   * Wraps a fetch request in convenience methods that sign the request, apply
   * default headers, appends the configured Api hostname, and processes the
   * response.
   */
  function request(uri, headers, body, method) {
    method = method || DefaultMethod;
    const init = {
      body,
      headers: Object.assign({}, DefaultHeaders, headers),
      method
    };
    const url = env.get('mavenlinkApiHostName') + uri;
    return signedFetch.then(fetch => fetch(url, init)).then(responseHandler);
  }

  // Builds a POST/PUT request that serializes form data
  function formRequest(method) {
    return (uri, data, headers) => {
      const body = serializeFormData(data);
      return request(uri, headers, body, method);
    };
  }

  return {
    get: request,
    post: formRequest('POST')
  };
};
