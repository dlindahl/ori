#! /usr/bin/env node

/*
 * A convoluted script that walks users through RSA Key generation for use in
 * signing OAuth requests
 */

const chalk = require('chalk');
const detectOpenSSL = require('./detectOpenSSL');
const generateKeys = require('./generateKeys');
const promptForKeyPrefix = require('./promptForKeyPrefix');
const promptForOutputPath = require('./promptForOutputPath');

// Go go gadget RSA Keys...!
module.exports = function main() {
  detectOpenSSL()
    .then(promptForOutputPath)
    .then(promptForKeyPrefix)
    .then(generateKeys)
    .then(() => {
      console.info(chalk.green('Success!'));
      process.exit(0);
    })
    .catch(err => {
      process.exit(1);
    });
};
