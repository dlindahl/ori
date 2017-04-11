# JIRA OAuth

> Command-line utility to request an OAuth token from JIRA

## Usage

### RSA Key Pairs

The Ori JIRA Public/Private Keys are securely stored in the ETA 1Password vault.

If, for some reason, you need to regenerate these key pairs, run the following command from the command-line and follow its instructions.

```bash
yarn generate:keys
```

Once you have generated new keys, *update* the Ori data in the 1Password ETA Vault and update the [Application Link](https://etateam.atlassian.net/plugins/servlet/applinks/listApplicationLinks) in JIRA.
