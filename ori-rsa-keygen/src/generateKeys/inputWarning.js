const boxen = require('boxen');
const chalk = require('chalk');

function demoStyle(key, value) {
  return `${chalk.cyan(`${key}:`)} ${chalk.green.bold(value)}`;
}

/*
 * Warns the user that they will be prompted to enter details as to who the
 * certificate applies and providing suggested values.
 */
module.exports = function inputWarning() {
  const header = `
${chalk.yellow('ATTENTION')}: This command will ask a
series of questions that will be
incorporated into the certificate.

The following is a list of values
you should use in response.
`;
  console.log(boxen(chalk.white(header), {dimBorder: true, padding: 1}));
  console.log('');
  console.log('');
  console.log(demoStyle('Country Name', 'US'));
  console.log(demoStyle('State or Province Name (full name)', 'Virginia'));
  console.log(demoStyle('Locality Name (eg, city)', 'Reston'));
  console.log(
    demoStyle(
      'Organization Name (eg, company) [Internet Widgits Pty Ltd]',
      'Emerging Technology Advisors'
    )
  );
  console.log(demoStyle('Organizational Unit Name (eg, section) []', 'hq'));
  console.log(
    demoStyle('Common Name (e.g. server FQDN or YOUR name) []', 'Ori')
  );
  console.log(demoStyle('Email Address []: ops@eta.im', 'ops@eta.im'));
  console.log('');
  console.log('');
  return Promise.resolve();
};
