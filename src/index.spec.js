const { expect } = require('chai');
const index = require('./index');

describe('index', () => {
  it('should contain an exec function', () => {
    expect(index.exec).to.be.a('function');
  });

  it('should contain an isInstalled function', () => {
    expect(index.isInstalled).to.be.a('function');
  });
});
