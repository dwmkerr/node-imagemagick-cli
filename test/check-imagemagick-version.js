const cli = require('../src/index');

cli.exec('convert -version')
  .then(({ stdout }) => console.log(stdout))
  .catch(({ message }) => { console.err(message); process.exit(1); });
