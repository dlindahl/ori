const env = require('./env');

const jira = require('./apiClients/jira');
const mavenlink = require('./apiClients/mavenlink');

// Creates instances of all of the support Api clients
module.exports = function createApiClients(event) {
  return {
    jira: jira.apiClient(
      event,
      env.get('jiraApiAccessToken'),
      env.get('jiraApiSecretKey')
    ),
    mavenlink: mavenlink.apiClient(
      event,
      env.get('mavenlinkApiAppId'),
      env.get('mavenlinkApiSecretToken')
    )
  };
};
