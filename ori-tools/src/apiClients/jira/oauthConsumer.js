const env = require('../../env');

const getConsumerSecret = require('./getConsumerSecret');
const OAuth = require('oauth').OAuth;

// OAuth constants, mostly specific to our Cloud instance
const AccessUrl = env.get('jiraOauthHostName') + env.get('accessUrl');
const RequestUrl = env.get('jiraOauthHostName') + env.get('requestUrl');
const Version = '1.0';

// Returns an OAuth Consumer preconfigured to work with our JIRA instance
module.exports = function jiraOauthConsumer(currentEndpoint) {
  const authorizeCallback = `${currentEndpoint}/oauth/callback`;
  return getConsumerSecret().then(consumerSecret => {
    return new OAuth(
      RequestUrl,
      AccessUrl,
      env.get('consumerKey'),
      consumerSecret,
      Version,
      authorizeCallback,
      env.get('signatureMethod')
    );
  });
};
