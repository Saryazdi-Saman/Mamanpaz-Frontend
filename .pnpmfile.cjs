function readPackage(pkg, context) {
  // Allow build scripts for these packages
  const allowedBuildScripts = [
    '@tailwindcss/oxide',
    'sharp', 
    'unrs-resolver'
  ];

  if (allowedBuildScripts.includes(pkg.name)) {
    // Mark these packages as safe to run build scripts
    pkg.scripts = pkg.scripts || {};
  }

  return pkg;
}

module.exports = {
  hooks: {
    readPackage
  }
};