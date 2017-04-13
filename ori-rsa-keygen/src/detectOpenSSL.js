const chalk = require('chalk');
const exec = require('child_process').exec;

/*
 * Detects whether or not `openssl` is installed on the user's machine. OpenSSL
 * is the tool that is used to generate the RSA keys.
 */
module.exports = function detectOpenSSL() {
  return new Promise((resolve, reject) => {
    exec('which openssl', (err, stdout, stderr) => {
      if (err) {
        console.log('');
        console.error(chalk.red('openssl is not installed!'));
        console.warn(
          chalk.yellow(
            `You need to install ${chalk.bold('openssl')} before continuing.`
          )
        );
        console.warn(
          chalk.yellow(
            `Maybe try running ${chalk.bold('brew install openssl')}?`
          )
        );
        console.log('');
        return reject();
      }
      return resolve();
    });
  });
};
