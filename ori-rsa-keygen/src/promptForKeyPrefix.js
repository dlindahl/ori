const chalk = require('chalk');
const readline = require('readline');

/*
 * Prompts the user to specific a key prefix so that all of the keys can be
 * grouped by name. If a non-standard key prefix is specified, the user will
 * need to set various ENV vars to point at their alternative keys.
 */
module.exports = function promptForKeyPrefix(outputPath) {
  return new Promise((resolve, reject) => {
    const defaultPrefix = 'jira';
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question(
      chalk.yellow(
        `Specify an key prefix: ${chalk.grey.dim(`(${defaultPrefix})`)} `
      ),
      prefix => {
        prefix = prefix || defaultPrefix;
        rl.close();
        resolve({outputPath, prefix});
      }
    );
  });
};
