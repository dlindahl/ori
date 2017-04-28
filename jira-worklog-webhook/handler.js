const createApiClients = require('ori-tools').createApiClients;
const find = require('lodash.find');

const MLMappingFieldId = 'customfield_11002';
let DefaultUser = null;
let MavenlinkUsers = null;

// Gets the Ori user for use as a default value in case a match cannot be made
function getDefaultUser(api) {
  if (DefaultUser) {
    return Promise.resolve(DefaultUser);
  }
  return api.mavenlink
    .get('/api/v1/users/me.json')
    .then(data => data.users[Object.keys(data.users)[0]])
    .then(user => DefaultUser = user);
}

// Gets the full details of the JIRA Issue that had time logged against it
function getIssue(api, issueKey) {
  return api.jira.get(`/rest/api/latest/issue/${issueKey}`);
}

// Finds the Mavenlink user that matches the JIRA user who logged the time entry
function getUser(api, username) {
  let getUsers = null;
  if (MavenlinkUsers) {
    getUsers = Promise.resolve(MavenlinkUsers);
  } else {
    getUsers = api.mavenlink
      .get('/api/v1/users.json')
      .then(users => MavenlinkUsers = users);
  }
  return getUsers.then(data => {
    find(
      data.users,
      user =>
        user.full_name.toLowerCase().includes(username) ||
        user.email_address.toLowerCase().includes(username)
    );
  });
}

// Maps the JIRA issue to a Mavenlink Story/Task
function mapToMavenlinkTask(api) {
  return ([defaultUser, jiraIssue, jiraUser]) => {
    const mapping = jiraIssue.fields[MLMappingFieldId];
    const mlWorkspace = mapping.value;
    const mlStory = mapping.child.value;

    return api.mavenlink
      .get('/api/v1/workspaces.json')
      .then(data => find(data.workspaces, { title: mlWorkspace }))
      .then(workspace =>
        api.mavenlink.get(`/api/v1/stories.json?workspace_id=${workspace.id}`)
      )
      .then(data => find(data.stories, { title: mlStory }))
      .then(story => ({
        story,
        user: defaultUser || jiraUser
      }));
  };
}

// Creates a Mavenlink Time Entry instance containing the time logged in JIRA
function createTimeEntry(api, worklog) {
  return ({ story, user }) =>
    api.mavenlink.post('/api/v1/time_entries.json', {
      time_entry: {
        date_performed: worklog.updatedAt,
        notes: worklog.comment,
        time_in_minutes: worklog.timeSpentSeconds / 60,
        user_id: user.id,
        story_id: story.id,
        workspace_id: story.workspace_id
      }
    });
}

// Respond with a "success" message to the Webhook Event
function respond(input, callback) {
  return timeEntry => {
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        input,
        timeEntry,
        message: 'Worklog successfully created in Mavenlink'
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
        input,
        err,
        message: 'Error'
      })
    };
    callback(null, response);
  };
}

// Extract the important parts from the Webhook Event
function processEvent(event) {
  const username = event.queryStringParameters.user_key.toLowerCase();
  const issueKey = event.queryStringParameters.issueKey;
  const projectId = event.queryStringParameters.projectId;
  const body = JSON.parse(event.body);
  const timeSpentSeconds = body.worklog.timeSpentSeconds;
  const debugData = {
    processedAt: new Date(Date.now()).toISOString(),
    webhook: body.webhookEvent,
    user: username,
    time: timeSpentSeconds,
    projectId,
    issueKey
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

// Process Worklog Webhook Event
module.exports.worklogWebhook = (event, context, callback) => {
  const api = createApiClients(event);
  const { debugData, worklog } = processEvent(event);

  Promise.all([
    getDefaultUser(api),
    getIssue(api, debugData.issueKey),
    getUser(api, debugData.user)
  ])
    .then(mapToMavenlinkTask(api))
    .then(createTimeEntry(api, worklog))
    .then(respond(event, callback))
    .catch(reportError(event, callback));
};
