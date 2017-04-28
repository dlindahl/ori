const env = require('../../env');
const fetchSignatory = require('./fetchSignatory');
const getEndpoint = require('../../getEndpoint');
const oauthConsumer = require('./oauthConsumer');
const responseHandler = require('../responseHandler');

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
  const currentEndpoint = getEndpoint(event);
  let signedFetch = oauthConsumer(currentEndpoint).then(consumer =>
    fetchSignatory(consumer, accessToken, secret));

  /*
   * Wraps a fetch request in convenience methods that sign the request, apply
   * default headers, appends the configured Api hostname, and processes the
   * response.
   */
  function request(uri, headers, method) {
    method = method || DefaultMethod;
    const init = {
      headers: Object.assign({}, DefaultHeaders, headers),
      method
    };
    const url = env.get('jiraOauthHostName') + uri;
    return signedFetch.then(fetch => fetch(url, init)).then(responseHandler);
  }

  return {
    get: request
  };
};
