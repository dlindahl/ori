const requestOauthToken = require('./requestOauthToken');

function fail(callback) {
  return error => {
    if (error.isRedirect) {
      throw error;
    }
    console.error(error);
    return callback(error);
  };
}

function ok(callback) {
  return response => {
    return callback(null, response);
  };
}

// Initiates the OAuth dance by requesting a token from JIRA
module.exports.requestOauthToken = (event, context, callback) => {
  return requestOauthToken(event).then(ok(callback)).catch(fail(callback));
};
};
