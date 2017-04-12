const env = require('../config/environment');

const fs = require('fs');
const OAuth = require('oauth').OAuth;
const path = require('path');

// OAuth constants, mostly specific to our Cloud instance
const AccessUrl = env.get('oauthHostName') + env.get('accessUrl');
const fullPrivateKey = path.join(__dirname, '..', env.get('privateKeyPath'));
if (!fs.existsSync(fullPrivateKey)) {
  throw new Error(
    `Private Key not found! Run 'yarn generate:keys' to generate ${fullPrivateKey}`
  );
}
const ConsumerSecret = fs.readFileSync(fullPrivateKey, 'utf8');
const RequestUrl = env.get('oauthHostName') + env.get('requestUrl');
const Version = '1.0';

// Returns an OAuth Consumer preconfigured to work with our JIRA instance
module.exports = function jiraOauthConsumer(currentEndpoint) {
  const authorizeCallback = `${currentEndpoint}/oauth/callback`;
  return new OAuth(
    RequestUrl,
    AccessUrl,
    env.get('consumerKey'),
    ConsumerSecret,
    Version,
    authorizeCallback,
    env.get('signatureMethod')
  );
};
