const AWS = require('aws-sdk');
const env = require('../env');

let SECRET = null;

module.exports = function getConsumerSecret() {
  if (SECRET) {
    return Promise.resolve(SECRET);
  }
  const s3 = new AWS.S3();
  return new Promise((resolve, reject) => {
    s3.getObject(
      {
        Bucket: env.get('oauthKeysS3Bucket'),
        Key: env.get('jiraOauthConsumerSecretPath')
      },
      (err, data) => {
        if (err) {
          return reject(err);
        }
        SECRET = data.Body.toString();
        return resolve(SECRET);
      }
    );
  });
};
