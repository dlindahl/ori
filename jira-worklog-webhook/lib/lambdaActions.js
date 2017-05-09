// Respond with a "success" message to the Webhook Event
function respond(action, input, callback) {
  return timeEntry => {
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        input,
        timeEntry,
        message: `Worklog successfully ${action} in Mavenlink`
      })
    };
    callback(null, response);
  };
}

// Respond with a "error" message to the Webhook Event
function reportError(input, callback) {
  return err => {
    const response = {
      statusCode: 500,
      body: JSON.stringify({
        error: err.toString(),
        input,
        message: 'Error',
        stacktrace: err.stack.split('\n')
      })
    };
    callback(null, response);
  };
}

module.exports = {
  respond,
  reportError
};
