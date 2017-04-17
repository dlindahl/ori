const env = require('ori-tools').env;
const getEndpoint = require('ori-tools').getEndpoint;
const jira = require('ori-tools').jira;

module.exports.worklogWebhook = (event, context, callback) => {
  const currentEndpoint = getEndpoint(event);
  const oa = jira.oauthConsumer(currentEndpoint);

  const user = event.queryStringParameters.user_key;
  const issueKey = event.queryStringParameters.issueKey;
  const projectId = event.queryStringParameters.projectId;

  const body = JSON.parse(event.body);
  const comment = body.worklog.comment;
  const timeSpentSeconds = body.worklog.timeSpentSeconds;
  const webhookEvent = body.webhookEvent;

  console.info({
    webhookEvent,
    user,
    issueKey,
    projectId,
    timeSpentSeconds,
    comment,
    user
  });

  const signedFetch = jira.fetchSignatory(
    oa,
    'Fps9xOcksa3eJ6RZhzZgUM7Nqrfu9nTZ',
    'vGWtETFZNCoJPQseBKGzM2ThFeckWQ4J'
  );

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      input: event,
      message: 'Go Serverless v1.0! Your function executed successfully!'
    })
  };

  signedFetch(env.get('oauthHostName') + `/rest/api/latest/issue/${issueKey}`, {
    headers: { contentType: 'application/json' }
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      console.info('OK!');
      console.info(data);
      callback(null, response);
    });
};
