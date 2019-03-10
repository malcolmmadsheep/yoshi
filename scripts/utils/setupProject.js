const path = require('path');
const fs = require('fs-extra');
const tempy = require('tempy');
const execa = require('execa');
const { authenticateToRegistry } = require('./publishMonorepo');

const isCI = !!process.env.TEAMCITY_VERSION;

module.exports = async templateDirectory => {
  const rootDirectory = tempy.directory();

  const testDirectory = path.join(rootDirectory, 'project');

  await fs.copy(templateDirectory, testDirectory);

  // Symlink modules locally for faster feedback
  if (!isCI) {
    await fs.ensureSymlink(
      path.join(__dirname, '../../packages/yoshi/node_modules'),
      path.join(rootDirectory, 'node_modules'),
    );

    await fs.ensureSymlink(
      path.join(__dirname, '../../packages/yoshi/bin/yoshi.js'),
      path.join(rootDirectory, 'node_modules/.bin/yoshi'),
    );

    // todo: globby.sync('packages/*').foreach(...)
    await fs.ensureSymlink(
      path.join(__dirname, '../../packages/yoshi'),
      path.join(testDirectory, 'node_modules/yoshi'),
    );

    await fs.ensureSymlink(
      path.join(__dirname, '../../packages/jest-yoshi-preset'),
      path.join(testDirectory, 'node_modules/jest-yoshi-preset'),
    );

    await fs.ensureSymlink(
      path.join(__dirname, '../../packages/yoshi-style-dependencies'),
      path.join(testDirectory, 'node_modules/yoshi-style-dependencies'),
    );

    await fs.ensureSymlink(
      path.join(__dirname, '../../packages/yoshi-angular-dependencies'),
      path.join(testDirectory, 'node_modules/yoshi-angular-dependencies'),
    );
  } else {
    // Authenticate and install from our fake registry on CI
    authenticateToRegistry(testDirectory);

    await execa.shell('npm install', {
      cwd: testDirectory,
      stdio: 'inherit',
      extendEnv: false,
      env: {
        PATH: process.env.PATH,
      },
    });
  }

  // Copy mocked `node_modules`
  await fs.copy(
    path.join(templateDirectory, '__node_modules__'),
    path.join(testDirectory, 'node_modules'),
  );

  return {
    testDirectory,
    rootDirectory,
  };
};
