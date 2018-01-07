const childProcess = require('child_process');

module.exports = function callImagemagick(command) {
  return new Promise((resolve, reject) => {
    childProcess.exec(`magick ${command}`, (err, stdout, stderr) => {
      if (err) {
        const errorMessage = `Failed to call '${command}. Error is '${err.message}'.`;
        const error = new Error(errorMessage);
        error.message = err.message;
        error.stdout = stdout;
        error.stderr = stderr;
        return reject(errorMessage);
      }

      return resolve({ stdout, stderr });
    });
  });
};
