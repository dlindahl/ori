const env = require('./src/env');
const findOriRoot = require('./src/findOriRoot');
const getEndpoint = require('./src/getEndpoint');
const isLambda = require('./src/isLambda');
const jiraOauthConsumer = require('./src/jiraOauthConsumer');

module.exports = {
  env,
  findOriRoot,
  getEndpoint,
  isLambda,
  jiraOauthConsumer
};
