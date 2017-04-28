const AWS = require('aws-sdk');
const env = require('../../env');

let ACCESS_TOKEN = null;

/*
 * Fetches the OAuth Token required to sign OAuth requests from S3, memoizing
 * the value to speed up subsequant requests.
 */
module.exports = function getOAuthToken() {
  if (ACCESS_TOKEN) {
    return Promise.resolve(ACCESS_TOKEN);
  }
  const s3 = new AWS.S3();
  return new Promise((resolve, reject) => {
    s3.getObject(
      {
        Bucket: env.get('oauthKeysS3Bucket'),
        Key: env.get('mavenlinkOauthTokenPath')
      },
      (err, data) => {
        if (err) {
          return reject(err);
        }
        let oauthToken = '';
        try {
          oauthToken = JSON.parse(data.Body.toString());
        } catch (err) {
          reject(err);
        }
        ACCESS_TOKEN = oauthToken.access_token;
        return resolve(ACCESS_TOKEN);
      }
    );
  });
};
