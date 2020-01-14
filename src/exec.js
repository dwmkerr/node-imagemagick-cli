const childProcess = require('child_process');
const debug = require('debug')('imagemagick-cli');
const deconstructCommand = require('./deconstruct-command');
const pickCli = require('./pick-cli');

//  For each command, we'll keep a map of the path to call it with. Example:
//  { convert: 'C:\ProgramData\chocolatey\bin\convert.exe' }
const cliPathsMap = {
};

async function mapCli(cli) {
  //  If we have already worked out the path to the CLI, great.
  if (cliPathsMap[cli]) return cliPathsMap[cli];

  //  If we're not on Windows, we just use the cli as-is.
  if (!/^win/.test(process.platform)) {
    cliPathsMap[cli] = cli;
    return cliPathsMap[cli];
  }

  //  On Windows we need to pick the right CLI, internally using the 'where'
  //  command.
  const cliPath = await pickCli(cli);

  //  If we have a found a path in the "ImageMagick" folder, we're good.
  if (/ImageMagick\//.test(cliPath)) {
    cliPathsMap[cli] = cliPath;
    return cliPath;
  }

  //  If we have *not* found a path, it is probably because we are calling
  //  a command like 'convert.exe' directly, rather than 'magick.exe convert'
  //  and using IM 7.0.1-Q16. So instead, search for the 'magick' CLI and use
  //  that.
  const magickCliPath = await pickCli('magick');
  if (!magickCliPath) {
    throw new Error('Could not find magick.exe. Is it installed in the default "ImageMagick" folder?');
  }
  cliPathsMap[cli] = magickCliPath;
  return magickCliPath;
}

async function exec(command) {
  //  First, extract the cli and parameters.
  const { cli, parameters } = deconstructCommand(command);

  //  Map the cli to a path.
  const mappedCli = await mapCli(cli);

  // Is this version 7.0.1-Q16?
  const isV701Q16 = !mappedCli.includes(cli);

  //  We have the CLI path mapped, which means we can reconstruct the command
  //  with the appropriate path and execute it.
  const reconstructedCommand = `"${mappedCli}" ${isV701Q16 ? cli : ''} ${parameters}`;
  debug(`Preparing to execute: ${reconstructedCommand}`);

  return new Promise((resolve, reject) => {
    try {
      return childProcess.exec(reconstructedCommand, (err, stdout, stderr) => {
        debug(`  err: ${err ? err.toString() : '<null>'}`);
        debug(`  stdout: ${stdout}`);
        debug(`  stderr: ${stderr}`);
        if (!stdout && err) {
          const errorMessage = `Failed to call '${command}', which was mapped to '${reconstructedCommand}'. Error is '${err.message}'.`;
          const error = new Error(errorMessage);
          error.stdout = stdout;
          error.stderr = stderr;
          return reject(error);
        }

        return resolve({ stdout, stderr });
      });
    } catch (err) {
      return reject(err);
    }
  });
}

module.exports = exec;
