const dotenv = require('dotenv');
dotenv.load();

const fs = require('fs');
const OAuth = require('oauth').OAuth;
const path = require('path');

// OAuth constants, mostly specific to our Cloud instance
const AccessUrl = `${process.env.JIRA_HOST_NAME}/plugins/servlet/oauth/access-token`;
const ConsumerKey = process.env.CONSUMER_KEY;
const fullPrivateKey = path.join(__dirname, '..', process.env.PRIVATE_KEY_PATH);
if (!fs.existsSync(fullPrivateKey)) {
  throw new Error(
    `Private Key not found! Run 'yarn generate:keys' to generate ${fullPrivateKey}`
  );
}
const ConsumerSecret = fs.readFileSync(fullPrivateKey, 'utf8');
const RequestUrl = `${process.env.JIRA_HOST_NAME}/plugins/servlet/oauth/request-token`;
const SignatureMethod = process.env.SIGNATURE_METHOD;
const Version = '1.0';

// Returns an OAuth Consumer preconfigured to work with our JIRA instance
module.exports = function jiraOauthConsumer(currentEndpoint) {
  const authorizeCallback = `${currentEndpoint}/oauth/callback`;
  return new OAuth(
    RequestUrl,
    AccessUrl,
    ConsumerKey,
    ConsumerSecret,
    Version,
    authorizeCallback,
    SignatureMethod
  );
};
