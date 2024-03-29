const env = require('ori-tools').env;

const getEndpoint = require('ori-tools').getEndpoint;
const jira = require('ori-tools').jira;
const oauthTokenCookie = require('./oauthTokenCookie');
const template = require('url-template');

// Initiates the OAuth dance with JIRA
module.exports = function requestToken(event) {
  const currentEndpoint = getEndpoint(event);
  return jira
    .oauthConsumer(currentEndpoint)
    .then(oa => {
      return new Promise((resolve, reject) => {
        oa.getOAuthRequestToken((error, oauthToken, oauthTokenSecret) => {
          if (error) {
            console.error('ERROR', error.data);
            const err = new Error(
              `Error getting OAuth access token: ${error.statusCode}`
            );
            return reject(err);
          }
          resolve({ oauthToken, oauthTokenSecret });
        });
      });
    })
    .then(tokens => {
      if (!tokens) {
        throw new Error('No tokens returned');
      }
      const redirectTmpl = template.parse(env.get('authorizeUrl'));
      const redirect = env.get('jiraOauthHostName') +
        redirectTmpl.expand({
          oauth_token: tokens.oauthToken
        });
      return {
        statusCode: 302,
        headers: {
          'Set-Cookie': oauthTokenCookie(event, tokens),
          Location: `${currentEndpoint}/oauth/sessions/create?redirect=${redirect}`
        }
      };
    });
};
