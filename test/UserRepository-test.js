import { expect } from 'chai';
import { exampleFunction1, exampleFunction2 } from '../src/domUpdates';

describe('User Repository', () => {
  it('should run tests', function () {
    expect(true).to.be.true;
  });

  it('should be a function', function() {

    expect(exampleFunction1).to.be.a('function')
    expect(exampleFunction1('Tayla')).to.equal('oh hi there Tayla')
  });
});