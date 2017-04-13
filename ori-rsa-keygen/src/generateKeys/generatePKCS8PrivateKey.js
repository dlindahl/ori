const openssl = require('./opensslRunner');
const path = require('path');

module.exports = function generatePKCS8PrivateKey(options) {
  const privateKeyPath = path.join(
    options.outputPath,
    `${options.prefix}_privatekey.pcks8`
  );
  const publicKeyPath = path.join(
    options.outputPath,
    `${options.prefix}_privatekey.pem`
  );
  return openssl(`Generating RSA PKCS Key at ${privateKeyPath}...`, [
    'pkcs8',
    '-topk8',
    '-nocrypt',
    '-in',
    publicKeyPath,
    '-out',
    privateKeyPath
  ]).then(result => options);
};
