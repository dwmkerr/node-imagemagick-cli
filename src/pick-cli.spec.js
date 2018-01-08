const { expect } = require('chai');
const sinon = require('sinon');
const pickCli = require('./pick-cli');

describe('pickCli', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it('should return the input cli when the platform is not windows', () => {
    pickCli('convert')
      .then((cli) => {
        expect(cli).to.eql('convert');
      });
  });

  it('should use the \'which\' command to identify potential tools on windows', () => {
    //  TODO test for which.
    pickCli('convert')
      .then((cli) => {
        expect(cli).to.eql('convert');
      });
  });

  it('should prefer a command in an \ImageMagick\' folder on windows', () => {
    //  TODO test for which.
    pickCli('convert')
      .then((cli) => {
        expect(cli).to.eql('convert');
      });
  });
});
