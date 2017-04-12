const dotenv = require('dotenv');
dotenv.load();

const getEndpoint = require('../util/getEndpoint');
const oauthConsumer = require('../util/jiraOauthConsumer');
const oauthTokenCookie = require('./oauthTokenCookie');

// Initiates the OAuth dance with JIRA
module.exports = function requestToken(event) {
  const currentEndpoint = getEndpoint(event);
  const oa = oauthConsumer(currentEndpoint);

  return new Promise((resolve, reject) => {
    oa.getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret) {
      if (error) {
        console.error('ERROR', error.data);
        const err = new Error(
          `Error getting OAuth access token: ${error.statusCode}`
        );
        return reject(err);
      }
      resolve({oauthToken, oauthTokenSecret});
    });
  }).then(tokens => {
    if (!tokens) {
      throw new Error('No tokens returned');
    }
    const redirect = process.env.JIRA_HOST_NAME +
      `/plugins/servlet/oauth/authorize?oauth_token=${tokens.oauthToken}`;
    return {
      statusCode: 302,
      headers: {
        'Set-Cookie': oauthTokenCookie(event, tokens),
        Location: `${currentEndpoint}/oauth/sessions/create?redirect=${redirect}`
      }
    };
  });
};
