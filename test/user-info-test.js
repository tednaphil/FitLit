import { expect } from 'chai';
import { testUsers } from '../src/data/test-data'; 
import { getUserInfo } from '../src/user-info';

describe('get user', function() {
    it('should be a function', function() {
        expect(getUserInfo).to.be.a("function")
    })
})
    
