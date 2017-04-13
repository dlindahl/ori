const chalk = require('chalk');
const generatePKCS8PrivateKey = require('./generatePKCS8PrivateKey');
const generatePKCSCertRequest = require('./generatePKCSCertRequest');
const generatePrivateRSAKey = require('./generatePrivateRSAKey');
const signCertificate = require('./signCertificate');

// Convenience method for the entire key generation workflow
module.exports = function generateKeys(options) {
  console.log(chalk.dim('Generating RSA Public/Private Key Pairs...'));
  console.log('');
  return generatePrivateRSAKey(options)
    .then(generatePKCSCertRequest)
    .then(generatePKCS8PrivateKey)
    .then(signCertificate);
};
