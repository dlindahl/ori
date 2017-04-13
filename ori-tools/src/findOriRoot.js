const path = require('path');
const pkgDir = require('pkg-dir');

const oriPkgName = 'ori';

// Iteritively walk up the folder structure looking for the root Ori folder
function walkUpFrom(p) {
  return pkgDir(p).then(foundPath => {
    const pkg = require(`${foundPath}/package.json`);
    if (pkg.name === oriPkgName) {
      return foundPath;
    } else {
      return walkUpFrom(path.join(foundPath, '..'));
    }
  });
}

function walkUpFromSync(p, walk) {
  const foundPath = pkgDir.sync(p);
  const pkg = require(`${foundPath}/package.json`);
  if (pkg.name === oriPkgName) {
    return foundPath;
  } else {
    return walkUpFromSync(path.join(foundPath, '..'));
  }
}

function findOriRoot(initialPath) {
  initialPath = initialPath || __dirname;
  return walkUpFrom(initialPath);
}

findOriRoot.sync = function syncFindOriRoot(initialPath) {
  return walkUpFromSync(initialPath);
};

module.exports = findOriRoot;
