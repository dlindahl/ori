'use strict';

module.exports.worklogWebhook = (event, context, callback) => {
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
    user,
  });

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      input: event,
      message: 'Go Serverless v1.0! Your function executed successfully!',
    }),
  };

  callback(null, response);
};
