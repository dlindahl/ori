const chalk = require('chalk');
const findOriRoot = require('ori-tools').findOriRoot;
const readline = require('readline');

/*
 * If the root folder could not be found, alert the user
 */
function handleNotFoundError(err) {
  if (err.code === 'MODULE_NOT_FOUND') {
    console.error(
      chalk.red(`Could not find root Ori folder from ${__dirname}`)
    );
  }
  throw err;
}

/*
 * Prompts the user to specify the path in which to store the generated keys in.
 * It is recommended that these keys be stored at the Project Ori root level so
 * that they can be easily shared amongst the difference AWS Lambda functions.
 */
function promptUser(defaultOutpath) {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    console.log('');
    console.log(chalk.dim('Configuring RSA Public/Private Key Generation...'));
    console.log(
      `
It is advised that the generated RSA key pairs be stored in the root directory
of the Ori project.
`
    );
    rl.question(
      chalk.yellow(
        `Specify an output directory: ${chalk.grey.dim(`(${defaultOutpath})`)} `
      ),
      outputPath => {
        outputPath = outputPath || defaultOutpath;
        rl.close();
        resolve(outputPath);
      }
    );
  });
}

module.exports = function promptForOutputPath() {
  return findOriRoot(__dirname).then(promptUser).catch(handleNotFoundError);
};
