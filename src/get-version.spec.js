const { expect } = require('chai');
const sinon = require('sinon'); const childProcess = require('child_process');
const getVersion = require('./get-version');

describe('getVersion', () => {
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

  it('should return null if the exec call fails', () => {
    //  Fake the OSX platform, otherwise on Windows we will try and use
    //  'where' to identify the cli.
    Object.defineProperty(process, 'platform', { value: 'darwin' });

    //  We expect 'childProcess.exec' to be called with 'convert -v'.
    sandbox.stub(childProcess, 'exec')
      .callsFake((cmd, callback) => {
        callback(new Error('Something bad happened.'));
      });

    return getVersion()
      .then((version) => {
        expect(version).to.eql(null);
      });
  });

  it('should be able to parse the version from the convert -version command', () => {
    //  Fake the OSX platform, otherwise on Windows we will try and use
    //  'where' to identify the cli.
    Object.defineProperty(process, 'platform', { value: 'darwin' });

    //  We expect 'childProcess.exec' to be called with 'convert -v'.
    sandbox.stub(childProcess, 'exec')
      .callsFake((cmd, callback) => {
        const output =
          `Version: ImageMagick 7.0.5-7 Q16 x86_64 2017-05-20 http://www.imagemagick.org
          Copyright: © 1999-2017 ImageMagick Studio LLC
          License: http://www.imagemagick.org/script/license.php
          Features: Cipher DPC HDRI Modules
          Delegates (built-in): bzlib freetype jng jpeg ltdl lzma png tiff xml zlib`;
        callback(null, output);
      });

    return getVersion()
      .then((version) => {
        expect(version).to.eql('7.0.5-7');
      });
  });
});
