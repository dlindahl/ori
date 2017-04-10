# JIRA Worklog Webhook

## Service Information

|             |                        |
| ----------- | ---------------------- |
| Service     | `jira-worklog-webhook` |
| Stage       | `prod`                 |
| Region      | `us-east-1`            |
| API Keys    | None                   |
| Endpoints   | GET - <https://vcy1un41r9.execute-api.us-east-1.amazonaws.com/prod/>   |
| Functions   | `jira-worklog-webhook: jira-worklog-webhook-prod-jira-worklog-webhook` |
| Webhook URL | `https://vcy1un41r9.execute-api.us-east-1.amazonaws.com/prod/?issueId=${issue.id}&issueKey=${issue.key}&projectId=${project.id}&projectKey=${project.key}&worklogId=${worklog.id}` |
