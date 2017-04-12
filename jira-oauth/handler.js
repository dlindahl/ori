const requestOauthToken = require('./requestOauthToken');

// Initiates the OAuth dance by requesting a token from JIRA
module.exports.requestOauthToken = (event, context, callback) => {
  return requestOauthToken(event)
    .then(response => callback(null, response))
    .catch(error => {
      if (error.isRedirect) {
        throw error;
      }
      console.error(error);
      return callback(error);
    });
};
