# JIRA OAuth

> Command-line utility to request an OAuth token from JIRA

## Service Information

|             |                                          |
| ----------- | ---------------------------------------- |
| Service     | `jira-oauth`                             |
| Stage       | `prod`                                   |
| Region      | `us-east-1`                              |
| API Keys    | None                                     |
| Endpoints   | GET - <https://3o22ge65p9.execute-api.us-east-1.amazonaws.com/prod/oauth/getToken><br>
GET - <https://3o22ge65p9.execute-api.us-east-1.amazonaws.com/prod/oauth/session/create> |
| Functions   | `jira-oauth: jira-oauth-prod-jira-oauth`<br>`sessionCreate: jira-oauth-prod-sessionCreate` |

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
