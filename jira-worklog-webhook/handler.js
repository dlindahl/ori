const createApiClients = require('ori-tools').createApiClients;
const {
  createTimeEntry,
  deleteTimeEntry,
  getUser,
  getDefaultUser,
  getMavenlinkStory,
  getTimeEntry,
  mapToMavenlinkWorkspace,
  updateTimeEntry
} = require('./lib/mavenlinkActions');
const { getIssue, processEvent } = require('./lib/jiraActions');
const { respond, reportError } = require('./lib/lambdaActions');

function timeAdded({ callback, debugData, event, worklog }) {
  const api = createApiClients(event);
  const { issueKey } = debugData;
  return Promise.all([
    getDefaultUser(api),
    getIssue(api, issueKey),
    getUser(api, worklog)
  ])
    .then(mapToMavenlinkWorkspace(api))
    .then(getMavenlinkStory(api))
    .then(createTimeEntry(api, worklog))
    .then(respond('created', event, callback))
    .catch(reportError(event, callback));
}

function timeDeleted({ callback, debugData, event, worklog }) {
  const api = createApiClients(event);
  const { issueKey, worklogId } = debugData;
  return Promise.all([
    getDefaultUser(api),
    getIssue(api, issueKey),
    getUser(api, worklog)
  ])
    .then(mapToMavenlinkWorkspace(api))
    .then(getTimeEntry(api, worklogId))
    .then(deleteTimeEntry(api, worklog))
    .then(respond('deleted', event, callback))
    .catch(reportError(event, callback));
}

function timeUpdated({ callback, debugData, event, worklog }) {
  const api = createApiClients(event);
  const { issueKey, worklogId } = debugData;
  return Promise.all([
    getDefaultUser(api),
    getIssue(api, issueKey),
    getUser(api, worklog)
  ])
    .then(mapToMavenlinkWorkspace(api))
    .then(getTimeEntry(api, worklogId))
    .then(updateTimeEntry(api, worklog))
    .then(respond('updated', event, callback))
    .catch(reportError(event, callback));
}

function unsupportedWebhook({ callback, event, debugData }) {
  const response = {
    statusCode: 404,
    body: JSON.stringify({
      input: event,
      message: `"${debugData.webhook}" webhook not yet supported`
    })
  };
  return callback(null, response);
}

// Process Worklog Webhook Event
module.exports.worklogWebhook = (event, context, callback) => {
  const { debugData, worklog } = processEvent(event);

  switch (debugData.webhook) {
    case 'worklog_created':
      return timeAdded({ callback, debugData, event, worklog });
    case 'worklog_deleted':
      return timeDeleted({ callback, debugData, event, worklog });
    case 'worklog_updated':
      return timeUpdated({ callback, debugData, event, worklog });
    default:
      return unsupportedWebhook({ callback, event, debugData });
  }
};
