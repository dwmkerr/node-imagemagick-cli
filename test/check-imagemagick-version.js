const cli = require('../src/index');

const checkVersion = process.env.CHECK_VERSION;
cli.getVersion()
  .then((version) => {
    console.log(`Checking for version: ${checkVersion}`);
    const rex = new RegExp(`^${checkVersion}`, 'i');
    if (rex.test(version)) {
      console.log('Success!');
      process.exit(0);
    } else {
      console.log('Failed');
      process.exit(1);
    }
  })
  .catch(({ message }) => {
    console.error(message);
    process.exit(1);
  });
