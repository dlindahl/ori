# JIRA OAuth

> Command-line utility to request an OAuth token from JIRA

## Service Information

|             |                                          |
| ----------- | ---------------------------------------- |
| Service     | `jira-oauth`                             |
| Stage       | `prod`                                   |
| Region      | `us-east-1`                              |
| API Keys    | None                                     |
| Endpoints   | GET - <https://3o22ge65p9.execute-api.us-east-1.amazonaws.com/prod/oauth/callback><br>GET - <https://3o22ge65p9.execute-api.us-east-1.amazonaws.com/prod/oauth/getToken><br>GET - <https://3o22ge65p9.execute-api.us-east-1.amazonaws.com/prod/oauth/session/create> |
| Functions   | `jira-oauth: jira-oauth-prod-jira-oauth`<br>`oauthCallback: jira-oauth-prod-oauthCallback`<br>`sessionCreate: jira-oauth-prod-sessionCreate` |

## Usage

### RSA Key Pairs

The Ori JIRA Public/Private Keys are securely stored in the ETA 1Password vault.

If, for some reason, you need to regenerate these key pairs, run the following command from the command-line and follow its instructions.

```bash
yarn generate:keys
```

Once you have generated new keys:

*   *update* the Ori data in the 1Password ETA Vault
*   update the [Application Link](https://etateam.atlassian.net/plugins/servlet/applinks/listApplicationLinks) in JIRA, specifically the Public Key entry
*   Re-deploy the `jira-oauth` lambda functions via `yarn deploy`
*   Initiate the OAuth Dance by accessing this lambda function's `oauth/getToken` endpoint
*   Authenticate with JIRA
*   Make note of the generated access tokens

## References

*   <https://docs.atlassian.com/jira/REST/cloud/>
*   <https://developer.atlassian.com/cloud/jira/platform/jira-rest-api-oauth-authentication/?_ga=1.122747211.1395250536.1483510620>
*   <https://bitbucket.org/atlassian_tutorial/atlassian-oauth-examples/src/0c6b54f6fefe996535fb0bdb87ad937e5ffc402d/nodejs/?at=default>
*   <https://developer.atlassian.com/jiradev/jira-apis/jira-rest-apis/jira-rest-api-tutorials/jira-rest-api-example-oauth-authentication>
*   <https://devup.co/jira-rest-api-oauth-authentication-in-node-js-2f8d226a493a>
