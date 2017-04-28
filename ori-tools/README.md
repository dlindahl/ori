# Ori Tools

> Various tools used in supporting Ori

# API Clients

## JIRA

In order to use the JIRA Api Client, you must ensure that your Lambda function
has access to the RSA Key S3 Bucket. Add the following to your `serverless.yaml`

```yaml
provider:
  # Needed in order to access the S3 bucket defined by ori-rsa-keygen
  iamRoleStatements:
    - Effect: Allow
      Action:
        - s3:*
      Resource: "*"
```
