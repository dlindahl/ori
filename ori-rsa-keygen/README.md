# Ori RSA Key Generation

> A command-line utility that walks users through RSA Key generation for use in signing OAuth requests

## Usage

The Ori JIRA Public/Private Keys are stored in an S3 bucket (`ori-rsa-keygen`) with backups securely stored in the ETA 1Password vault.

### Downloading existing keys

To download the existing keys from S3 to your local machine:

```bash
yarn keys:down
```

### Generating new keys:

If, for some reason, you need to regenerate these key pairs, this command will walk you through the process:

```bash
yarn keys:create
```

#### Post Key Generation

Once you have generated new keys:

*   Upload the new keys to S3 with `yarn keys:up`
*   Update the Ori data in the 1Password ETA Vault
*   Update the [Application Link][jira-app-link] in JIRA, specifically the Public Key entry
*   Run through the OAuth "dance" by accessing the `jira-oauth` [`oauth/getToken` endpoint][jira-oauth-endpoints]
*   Make note of the generated access tokens

[jira-app-link]: https://etateam.atlassian.net/plugins/servlet/applinks/listApplicationLinks
[jira-oauth-endpoints]: https://github.com/EmergingTechnologyAdvisors/ori/tree/master/jira-oauth#service-information
