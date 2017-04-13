const fs = require('fs');
const openssl = require('./opensslRunner');
const path = require('path');

module.exports = function signCertificate(options) {
  const cerPath = path.join(
    options.outputPath,
    `${options.prefix}_publickey.cer`
  );
  const keyPath = path.join(
    options.outputPath,
    `${options.prefix}_publickey.pem`
  );
  const writeStream = fs.createWriteStream(keyPath, {flags: 'w'});
  return openssl(
    `Signing RSA Keys at ${cerPath}...`,
    ['x509', '-pubkey', '-noout', '-in', cerPath],
    {writeStream}
  ).then(result => options);
};
