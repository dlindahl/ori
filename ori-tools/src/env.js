const convict = require('convict');
const dotenv = require('dotenv');
const path = require('path');

// This is a no-op on AWS
dotenv.load(path.join(process.cwd(), '.env'));

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
  jiraApiAccessToken: {
    doc: 'Your JIRA API Access Token',
    format: String,
    default: null,
    env: 'JIRA_API_ACCESS_TOKEN'
  },
  jiraApiSecretKey: {
    doc: 'Your JIRA API Secret Key',
    format: String,
    default: null,
    env: 'JIRA_API_SECRET_KEY'
  },
  jiraOauthConsumerSecretPath: {
    doc: 'The name of the file that contains the Consumer Secret for JIRA OAuth requests',
    format: String,
    default: 'keys/jira_privatekey.pcks8',
    env: 'JIRA_OAUTH_CONSUMER_SECRET_PATH'
  },
  jiraOauthHostName: {
    doc: 'The hostname (including protocol) of the OAuth application',
    format: String,
    default: 'https://etateam.atlassian.net',
    env: 'JIRA_OAUTH_HOST_NAME'
  },
  mavenlinkApiAppId: {
    doc: 'Mavenlink API Application ID for Project Ori',
    format: String,
    default: null,
    env: 'MAVENLINK_API_APP_ID'
  },
  mavenlinkApiSecretToken: {
    doc: 'Mavenlink API Secret Token',
    format: String,
    default: null,
    env: 'MAVENLINK_API_SECRET_TOKEN'
  },
  mavenlinkApiHostName: {
    doc: 'The hostname (including protocol) of the Mavenlink application',
    format: String,
    default: 'https://api.mavenlink.com',
    env: 'MAVENLINK_API_HOST_NAME'
  },
  mavenlinkOauthTokenPath: {
    doc: 'The name of the file that contains the OAuth Token for Mavenlink OAuth requests',
    format: String,
    default: 'mavenlink/oauth_token.json',
    env: 'MAVENLINK_OAUTH_TOKEN_PATH'
  },
  oauthKeysS3Bucket: {
    doc: 'The name of the S3 bucket that contains import Ori RSA Keys',
    format: String,
    default: 'ori-rsa-keygen',
    env: 'OAUTH_KEYS_S3_BUCKET'
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
