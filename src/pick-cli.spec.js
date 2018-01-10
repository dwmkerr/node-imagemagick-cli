const { expect } = require('chai');
const sinon = require('sinon');
const childProcess = require('child_process');
const pickCli = require('./pick-cli');

describe('pickCli', () => {
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

  it('should return the input cli when the platform is not windows', () => {
    Object.defineProperty(process, 'platform', { value: 'darwin' });
    return pickCli('convert')
      .then((cli) => {
        expect(cli).to.eql('convert');
      });
  });

  it('should reject with the error from exec if exec fails', () => {
    //  Fake the win32 platform.
    Object.defineProperty(process, 'platform', { value: 'win32' });

    //  We expect 'childProcess.exec' to be called with 'which'.
    const mock = sandbox.mock(childProcess)
      .expects('exec')
      .withArgs('where convert')
      .once()
      .callsFake((cmd, callback) => {
        callback(new Error('Something broke.'));
      });

    //  When we look for convert, we expect to get back the path from 'where'.
    return pickCli('convert')
      .catch((err) => {
        expect(err.message).to.eql('Something broke.');
        mock.verify();
      });
  });

  it('should use the \'which\' command to identify potential tools on windows', () => {
    //  Fake the win32 platform.
    Object.defineProperty(process, 'platform', { value: 'win32' });

    //  We expect 'childProcess.exec' to be called with 'which'.
    const mock = sandbox.mock(childProcess)
      .expects('exec')
      .withArgs('where convert')
      .once()
      .callsFake((cmd, callback) => {
        callback(null, 'c:\\SomeFolder\\convert.exe');
      });

    //  When we look for convert, we expect to get back the path from 'where'.
    return pickCli('convert')
      .then((cli) => {
        expect(cli).to.eql('c:\\SomeFolder\\convert.exe');
        mock.verify();
      });
  });

  it('should prefer a command in an \'ImageMagick\' folder on windows', () => {
    //  Fake the win32 platform.
    Object.defineProperty(process, 'platform', { value: 'win32' });

    //  We expect 'childProcess.exec' to be called with 'which'.
    const mock = sandbox.mock(childProcess)
      .expects('exec')
      .withArgs('where convert')
      .once()
      .callsFake((cmd, callback) => {
        //  Give a set of paths, essentially mocking the 'convert' problem:
        //  http://www.imagemagick.org/Usage/windows/#convert_issue
        const paths = [
          'c:\\System32\\convert.exe',
          'c:\\ProgramFiles\\ImageMagick\\Convert.exe',
        ];
        callback(null, paths.join('\r\n'));
      });

    //  We should prefer the ImageMagick path.
    return pickCli('convert')
      .then((cli) => {
        expect(cli).to.eql('c:\\ProgramFiles\\ImageMagick\\Convert.exe');
        mock.verify();
      });
  });
});
