const { expect } = require('chai');
const sinon = require('sinon'); const childProcess = require('child_process');
const exec = require('./exec');

describe('exec', () => {
  const sandbox = sinon.createSandbox();
  let platform;

  beforeEach(() => {
    //  Save the platform, we'll mess with it in tests.
    platform = Object.getOwnPropertyDescriptor(process, 'platform');
  });

  afterEach(() => {
    Object.defineProperty(process, 'platform', platform);
    sandbox.restore();
  });

  it('should fail if the command is not in the form \'cmd\' \'parameters\'', () => {
    return exec('command-only')
      .then(() => {
        throw new Error('This call should not succeed.');
      })
      .catch((err) => {
        expect(err.message).to.match(/cli*.parameters/);
      });
  });

  it('should return a sensible error if the command does not exist', () => {
    //  Fake the OSX platform, otherwise on Windows we will try and use
    //  'where' to identify the cli.
    Object.defineProperty(process, 'platform', { value: 'darwin' });

    //  We expect 'childProcess.exec' to be called with 'which'.
    sandbox.stub(childProcess, 'exec')
      .callsFake((cmd, callback) => {
        const err = new Error('command: no-way does not exist');
        callback(err, null, 'command: no-way does not exist');
      });

    return exec('no-way parameters')
      .then(() => {
        throw new Error('This command should fail.');
      })
      .catch((err) => {
        expect(err.message).to.match(/does not exist/);
        expect(err.stderr).to.match(/does not exist/);
      });
  });

  it('should prefer a command in an \'ImageMagick\' folder on windows', () => {
    //  Fake the win32 platform.
    Object.defineProperty(process, 'platform', { value: 'win32' });

    //  We expect 'childProcess.exec' to be called with 'which'.
    sandbox.stub(childProcess, 'exec')
      .withArgs('where convert')
      .callsFake((cmd, callback) => {
        //  Give a set of paths, essentially mocking the 'convert' problem:
        //  http://www.imagemagick.org/Usage/windows/#convert_issue
        const paths = [
          'c:\\System32\\convert.exe',
          'c:\\ProgramFiles\\ImageMagick\\Convert.exe',
        ];
        callback(null, paths.join('\r\n'));
      })
      //  Notice that the path is quoted...
      .withArgs('"c:\\ProgramFiles\\ImageMagick\\Convert.exe" -v')
      .callsFake((cmd, callback) => {
        callback(null, 'Version: ImageMagick');
      });

    //  We should prefer the ImageMagick path.
    return exec('convert -v')
      .then(({ stdout }) => {
        expect(stdout).to.match(/Version: ImageMagick/);
      })
      .catch((err) => { throw new Error(`'${err}' should not be thrown.`); });
  });
});
