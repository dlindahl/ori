const env = require('../../env');
const fetchSignatory = require('./fetchSignatory');
const getEndpoint = require('../../getEndpoint');
const oauthConsumer = require('./oauthConsumer');
const responseHandler = require('../responseHandler');

const DefaultHeaders = {
  contentType: 'application/json'
};

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
   * Convenience method for binding a signed fetch request to a particular HTTP
   * method with automatic hostname appending and response handling.
   */
  function methodRequest(method) {
    return (uri, headers, body) => {
      const init = {
        body,
        headers: Object.assign({}, DefaultHeaders, headers),
        method
      };
      const url = env.get('jiraOauthHostName') + uri;
      return signedFetch.then(fetch => fetch(url, init)).then(responseHandler);
    };
  }

  return {
    get: methodRequest('GET')
  };
};
