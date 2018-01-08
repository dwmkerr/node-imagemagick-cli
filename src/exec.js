const childProcess = require('child_process');

//  For each command, we'll keep a map of the path to call it with. Example:
//  { convert: 'C:\ProgramData\chocolatey\bin\convert.exe' }

module.exports = function exec(command) {
  return new Promise((resolve, reject) => {
    //  TODO: if IM 7 and windows, we should use 'magick' here.
    childProcess.exec(`${command}`, (err, stdout, stderr) => {
      if (err) {
        const errorMessage = `Failed to call '${command}. Error is '${err.message}'.`;
        const error = new Error(errorMessage);
        error.message = err.message;
        error.stdout = stdout;
        error.stderr = stderr;
        return reject(error);
      }

      return resolve({ stdout, stderr });
    });
  });
};
