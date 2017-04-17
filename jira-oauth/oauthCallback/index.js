const cookie = require('cookie');
const getEndpoint = require('ori-tools').getEndpoint;
const jiraOauthConsumer = require('ori-tools').jiraOauthConsumer;

function getTokens(event) {
  const cookies = cookie.parse(event.headers.Cookie);
  let tokens = {};
  try {
    tokens = JSON.parse(cookies.oauth);
  } catch (err) {
    console.error(
      `Could not parse OAuth Token cookie! ${event.headers.Cookie}`
    );
  }
  return tokens;
}

/*
 * Finishes the OAuth dance by using the OAuth Tokens and requesting an Access
 * Token. This will then be used to sign all JIRA API requests.
 */
module.exports = function oauthCallback(event) {
  const tokens = getTokens(event);
  const currentEndpoint = getEndpoint(event);
  const oa = jiraOauthConsumer(currentEndpoint);
  return new Promise((resolve, reject) => {
    oa.getOAuthAccessToken(
      event.queryStringParameters.oauth_token,
      tokens.oauthTokenSecret,
      event.queryStringParameters.oauth_verifier,
      (error, oauthAccessToken, oauthAccessTokenSecret) => {
        if (error) {
          console.error('Error', error);
          return reject(error);
        }
        resolve({
          statusCode: 200,
          body: JSON.stringify({
            message: 'successfully authenticated.',
            access_token: oauthAccessToken,
            secret: oauthAccessTokenSecret
          })
        });
      }
    );
  });
};
