const path = require('path');
const pkgDir = require('pkg-dir');

// Iteritively walk up the folder structure looking for the root Ori folder
function walkUpFrom(p) {
  return pkgDir(p).then(foundPath => {
    const pkg = require(`${foundPath}/package.json`);
    if (pkg.name === 'ori') {
      return foundPath;
    } else {
      return walkUpFrom(path.join(foundPath, '..'));
    }
  });
}

module.exports = function findOriRoot(initialPath) {
  initialPath = initialPath || __dirname;
  return walkUpFrom(initialPath);
};
