const { expect } = require('chai');
const deconstructCommand = require('./deconstruct-command');

describe('deconstructCommand', () => {
  it('should throw if the command is falsey', () => {
    expect(() => deconstructCommand()).to.throw(/command.*required/);
  });

  it('should throw if the command does not appear to be made up of a cli and parameters', () => {
    expect(() => deconstructCommand('no-parameters')).to.throw(/cli.*parameters/);
  });

  it('should be able to extract a cli name and parameters from a command', () => {
    const { cli, parameters } = deconstructCommand('convert -v');
    expect(cli).to.eql('convert');
    expect(parameters).to.eql('-v');
  });

  it('should coerce cli names into lowercase', () => {
    const { cli, parameters } = deconstructCommand('iDEnTiFY -i icon.png');
    expect(cli).to.eql('identify');
    expect(parameters).to.eql('-i icon.png');
  });
});
