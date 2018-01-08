const commandExistsCallback = require('command-exists');

//  Promisified version of command exists, with more standard error handling.
function commandExists(command) {
  return new Promise((resolve, reject) => {
    commandExistsCallback(command, (err, exists) => {
      if (err) return reject(err);
      return resolve(exists);
    });
  });
}

function getVersion() {
  return Promise.all([commandExists('identify'), commandExists('magick')])
    .then(([identifyExists, magickExists]) => {
      //  From the presence of these commands, we can infer the version.
      // if (iden
    // });
    });
}

module.exports = getVersion;
