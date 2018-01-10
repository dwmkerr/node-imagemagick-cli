const cli = require('../src/index');

const checkVersion = process.env.CHECK_VERSION;

cli.exec('convert -version')
  .then(({ stdout }) => {
    //  Log the output.
    console.log(stdout);

    //  Check the version.
    const rex = new RegExp(`Version: ImageMagick ${checkVersion}`);
    console.log(`Checking for version: ${checkVersion}`);
    if (rex.test(stdout)) {
      console.log('Success!');
      process.exit(0);
    } else {
      console.log('Failed');
      process.exit(1);
    }
  })
  .catch(({ message }) => { console.error(message); process.exit(1); });
