// Gets the full details of the JIRA Issue that had time logged against it
function getIssue(api, issueKey) {
  return api.jira.get(`/rest/api/latest/issue/${issueKey}`);
}

// Extract the important parts from the Webhook Event
function processEvent(event) {
  const username = event.queryStringParameters.user_key.toLowerCase();
  const issueKey = event.queryStringParameters.issueKey;
  const projectId = event.queryStringParameters.projectId;
  const worklogId = event.queryStringParameters.worklogId;
  const body = JSON.parse(event.body);
  const timeSpentSeconds = body.worklog.timeSpentSeconds;
  const debugData = {
    processedAt: new Date(Date.now()).toISOString(),
    webhook: body.webhookEvent,
    user: username,
    time: timeSpentSeconds,
    projectId,
    issueKey,
    worklogId
  };

  return {
    // Data appended to end of worklog comment to aid in debugging
    debugData,
    // Most important bits of info used in Mavenlink Time Entry generation
    worklog: {
      comment: `${issueKey} - ${body.worklog.comment} (Processed by Project Ori ${JSON.stringify(debugData)})`,
      timeSpentSeconds,
      updatedAt: body.worklog.updated,
      author: {
        full_name: body.worklog.author.displayName,
        name: body.worklog.author.name,
        username: body.worklog.author.key
      }
    }
  };
}

module.exports = {
  getIssue,
  processEvent
};
