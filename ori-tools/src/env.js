const convict = require('convict');
const dotenv = require('dotenv');
const findOriRoot = require('./findOriRoot');
const isLambda = require('./isLambda');
const path = require('path');

// Dotenv doesn't work on AWS Lambda so don't even attempt to parse a .env
if (!isLambda) {
  const oriRootPath = findOriRoot.sync(__dirname);
  dotenv.load(path.join(oriRootPath, '.env'));
}

const config = convict({
  accessUrl: {
    doc: 'The URL used to generate an OAuth access token',
    format: String,
    default: '/plugins/servlet/oauth/access-token',
    env: 'OAUTH_ACCESS_URL'
  },
  authorizeUrl: {
    doc: 'The URL, in the form of a RFC 6570 URI Template, used to authorize OAuth tokens',
    format: String,
    default: '/plugins/servlet/oauth/authorize{?oauth_token}',
    env: 'OAUTH_AUTHORIZE_URL'
  },
  consumerKey: {
    doc: 'The key supplied by the Ori application to the OAuth application',
    format: String,
    default: 'qDuE7x38gF9R7kt',
    env: 'CONSUMER_KEY'
  },
  oauthHostName: {
    doc: 'The hostname (including protocol) of the OAuth application',
    format: String,
    default: 'https://etateam.atlassian.net',
    env: 'OAUTH_HOST_NAME'
  },
  privateKeyPath: {
    doc: 'The path, relative to the root of this application, to the Private Key file (.pcks8 or .pem)',
    format: String,
    default: '../jira_privatekey.pcks8',
    env: 'PRIVATE_KEY_PATH'
  },
  requestUrl: {
    doc: 'The URL used to generate an OAuth request token',
    format: String,
    default: '/plugins/servlet/oauth/request-token',
    env: 'OAUTH_REQUEST_URL'
  },
  signatureMethod: {
    doc: 'The method used to sign the private key',
    format: String,
    default: 'RSA-SHA1',
    env: 'SIGNATURE_METHOD'
  }
});

config.validate();

module.exports = config;
