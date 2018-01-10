const { expect } = require('chai');
const index = require('./index');

describe('index', () => {
  it('should contain an exec function', () => {
    expect(index.exec).to.be.a('function');
  });

  it('should contain a getVersion function', () => {
    expect(index.getVersion).to.be.a('function');
  });
});
