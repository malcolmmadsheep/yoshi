// Assign env vars before requiring anything so that it is available to all files
process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';

import arg from 'arg';
import chalk from 'chalk';
import execa from 'execa';
import { startCDN } from 'yoshi-common/build/cdn';
import {
  hasBundleInStaticsDir,
  hasE2ETests,
} from 'yoshi-helpers/build/queries';
import { cliCommand } from '../cli';

const test: cliCommand = async function(argv, config) {
  const args = arg(
    {
      // Types
      '--help': Boolean,
      '--watch': Boolean,

      // Aliases
      '-h': '--help',
    },
    { argv },
  );

  const { '--help': help, '--watch': watch } = args;

  if (help) {
    console.log(
      `
      Description
        Running the tests

      Usage
        $ yoshi-library test

      Options
        --help, -h      Displays this message
        --watch         Runs the tests in watch mode
    `,
    );

    process.exit(0);
  }

  let closeCdn = () => {};

  if (hasE2ETests() && !watch) {
    if (!hasBundleInStaticsDir()) {
      console.error();
      console.error(
        chalk.red(
          ' ● Warning:\n\n' +
            '   you are running e2e tests and does not have any bundle located in the statics directory\n' +
            '   you probably need to run ' +
            chalk.bold('npx yoshi-library build') +
            ' before running the tests',
        ),
      );
      console.error();
    }

    closeCdn = (await startCDN({ ssl: false, port: config.port })).close;
  }

  const jestCliOptions = [
    require.resolve('jest/bin/jest'),
    `--rootDir=${process.cwd()}`,
  ];

  watch && jestCliOptions.push('--watch');

  try {
    await execa('node', jestCliOptions, { stdio: 'inherit' });
    closeCdn();
  } catch (error) {
    console.error(`jest failed with status code "${error.code}"`);
    closeCdn();
    process.exit(1);
  }
};

export default test;
