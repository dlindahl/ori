const globby = require('globby');

function globPattern(include, exclude) {
  const patterns = [];
  (exclude || []).forEach(pattern => {
    if (pattern.charAt(0) !== '!') {
      patterns.push(`!${pattern}`);
    } else {
      patterns.push(pattern.substring(1));
    }
  });
  // push the include globs to the end of the array
  // (files and folders will be re-added again even if they were excluded beforehand)
  (include || []).forEach(pattern => {
    patterns.push(pattern);
  });
  return patterns;
}

// Ported from https://github.com/serverless/serverless/blob/c345e9a9bfb5dd49a13788009430e24c400243f2/lib/plugins/aws/package/lib/zipService.js#L10-L25
module.exports = function getFiles(sls, include, exclude) {
  const files = globby.sync(globPattern(include, exclude), {
    cwd: sls.config.servicePath,
    dot: true,
    nodir: true,
    realpath: true,
    silent: true,
    follow: true
  });
  return files;
};

module.exports.globPattern = globPattern;
