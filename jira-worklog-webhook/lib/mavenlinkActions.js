const find = require('lodash.find');

let DefaultUser = null;
let MavenlinkUsers = null;
const MLMappingFieldId = 'customfield_11002';
const WorklogData = /({[^}]+})\)/;

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

function deleteTimeEntry(api) {
  return timeEntry =>
    api.mavenlink.delete(`/api/v1/time_entries/${timeEntry.id}.json`);
}

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

// Maps the JIRA issue to a Mavenlink Story/Task
function getMavenlinkStory(api) {
  return ({ jiraIssue, user, workspace }) => {
    const mapping = jiraIssue.fields[MLMappingFieldId];
    const mlStory = mapping.child.value;

    return api.mavenlink
      .get(`/api/v1/stories.json?workspace_id=${workspace.id}`)
      .then(data => find(data.stories, { title: mlStory }))
      .then(story => ({
        story,
        user
      }));
  };
}

function getTimeEntry(api, worklogId) {
  return ({ workspace }) => {
    return api.mavenlink
      .get(`/api/v1/time_entries.json?workspace_id=${workspace.id}`)
      .then(({ time_entries: timeEntries }) => {
        return find(timeEntries, timeEntry => {
          let data;
          try {
            data = JSON.parse(timeEntry.notes.match(WorklogData)[1]);
          } catch (err) {
            throw new Error(
              `${err.message}: Could not parse worklog data from time entry note ${timeEntry.note}`
            );
          }
          return data.worklogId === worklogId;
        });
      });
  };
}

// Finds the Mavenlink user that matches the JIRA user who logged the time entry
function getUser(api, { author }) {
  let getUsers = null;
  if (MavenlinkUsers) {
    getUsers = Promise.resolve(MavenlinkUsers);
  } else {
    getUsers = api.mavenlink
      .get('/api/v1/users.json')
      .then(users => MavenlinkUsers = users);
  }
  const fullName = author.full_name.toLowerCase();
  return getUsers.then(({ users }) =>
    find(
      users,
      user =>
        user.full_name.toLowerCase() == fullName ||
        user.email_address.toLowerCase().includes(author.username)
    )
  );
}

function mapToMavenlinkWorkspace(api) {
  return ([defaultUser, jiraIssue, jiraUser]) => {
    const mapping = jiraIssue.fields[MLMappingFieldId];
    const mlWorkspace = mapping.value;
    const user = jiraUser || defaultUser;

    return api.mavenlink
      .get('/api/v1/workspaces.json')
      .then(data => find(data.workspaces, { title: mlWorkspace }))
      .then(workspace => ({ jiraIssue, user, workspace }));
  };
}

function updateTimeEntry(api, worklog) {
  return timeEntry =>
    api.mavenlink.put(`/api/v1/time_entries/${timeEntry.id}.json`, {
      time_entry: {
        notes: worklog.comment,
        time_in_minutes: worklog.timeSpentSeconds / 60
      }
    });
}

module.exports = {
  createTimeEntry,
  deleteTimeEntry,
  getDefaultUser,
  getTimeEntry,
  getUser,
  mapToMavenlinkWorkspace,
  getMavenlinkStory,
  updateTimeEntry
};
