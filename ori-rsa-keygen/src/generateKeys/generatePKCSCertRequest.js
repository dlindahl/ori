const inputWarning = require('./inputWarning');
const openssl = require('./opensslRunner');
const path = require('path');

module.exports = function generatePKCSCertRequest(options) {
  inputWarning();
  const cerPath = path.join(
    options.outputPath,
    `${options.prefix}_publickey.cer`
  );
  const keyPath = path.join(
    options.outputPath,
    `${options.prefix}_privatekey.pem`
  );
  return openssl(
    `Generating RSA PKCS Certificate at ${cerPath}...`,
    [
      'req',
      '-newkey',
      'rsa:1024',
      '-x509',
      '-key',
      keyPath,
      '-out',
      cerPath,
      '-days',
      '365'
    ],
    {interactive: true}
  ).then(result => options);
};
