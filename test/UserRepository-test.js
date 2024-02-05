import { expect } from 'chai';
import { exampleFunction1, exampleFunction2 } from '../src/domUpdates';
// import { testThis } from '../src/scripts';

describe('User Repository', () => {
  it('should run tests', function () {
    expect(true).to.be.true;
  });

  it('should be a function', function() {

    expect(exampleFunction1).to.be.a('function')
    expect(exampleFunction1('Tayla')).to.equal('oh hi there Tayla')
  });

  // it('should be a function', function() {

  //   expect(testThis).to.be.a('function')
  // });
});
