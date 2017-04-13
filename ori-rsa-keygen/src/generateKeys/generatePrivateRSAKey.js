const openssl = require('./opensslRunner');
const path = require('path');

module.exports = function generatePrivateRSAKey(options) {
  const keyPath = path.join(
    options.outputPath,
    `${options.prefix}_privatekey.pem`
  );
  return openssl(`Generating RSA Key at ${keyPath}...`, [
    'genrsa',
    '-out',
    keyPath,
    '1024'
  ]).then(result => options);
};
