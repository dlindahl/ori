# Ori RSA Key Generation

> A command-line utility that walks users through RSA Key generation for use in signing OAuth requests

## Installation

Install this package by specifying it as a local dependency in your `package.json`

```json
"dependencies": {
  "ori-rsa-keygen": "file:../ori-rsa-keygen"
}
```

## Usage

The Ori JIRA Public/Private Keys are securely stored in the ETA 1Password vault.

If, for some reason, you need to regenerate these key pairs, this package includes an easy to use script that you can run that will walk you through the process. The following are two different ways you can choose to run this command.

###### Direct Execution

Run the following command from the command-line and follow its instructions:

```bash
./node_modules/rsa-keygen
```

###### NPM Scripts

Add a `script` entry in your `package.json` so you can run the command with `npm run rsa-keygen` (or `yarn rsa-keygen`)

```json
{
  "scripts": {
    "rsa-keygen": "rsa-keygen"
  }
}
```

#### Post Key Generation

Once you have generated new keys:

*   Update the Ori data in the 1Password ETA Vault
*   Update the [Application Link][jira-app-link] in JIRA, specifically the Public Key entry
*   Re-deploy the [`jira-oauth`][jira-oauth] lambda functions via `yarn deploy`
*   Run through the OAuth "dance" by accessing the `jira-oauth` [`oauth/getToken` endpoint][jira-oauth-endpoints]
*   Make note of the generated access tokens

[jira-app-link]: https://etateam.atlassian.net/plugins/servlet/applinks/listApplicationLinks
[jira-oauth]: https://github.com/EmergingTechnologyAdvisors/ori/tree/master/jira-oauth
[jira-oauth-endpoints]: https://github.com/EmergingTechnologyAdvisors/ori/tree/master/jira-oauth#service-information
