const chalk = require('chalk');
const spawn = require('child_process').spawn;

/*
 * Convenience method for running various OpenSSL commands
 */
module.exports = function opensslRunner(descr, args, options) {
  options = options || {};
  return new Promise((resolve, reject) => {
    console.info(chalk.gray(descr));
    console.info(chalk.dim(`  openssl ${args.join(' ')}`));
    const cmd = spawn('openssl', args);
    const err = [];
    if (options.interactive) {
      console.info('');
      // Shift input/ouput from this process to the spawned process
      process.stdin.pipe(cmd.stdin);
      cmd.stdout.pipe(process.stdout);
      cmd.stderr.on('data', data => {
        // Re-print messages from the spawned process
        process.stdout.write(data.toString());
      });
    }
    if (options.writeStream) {
      cmd.stdout.pipe(options.writeStream);
      cmd.stderr.on('data', data => {
        err.push(data.toString());
      });
    }
    cmd.on('close', data => {
      if (options.interactive) {
        console.info('');
      }
      if (err.length) {
        throw new Error(chalk.red(err.join('\n')));
      }
      resolve();
    });
  });
};
