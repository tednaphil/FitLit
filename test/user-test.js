import { expect } from 'chai';
import { testUsers } from '../src/data/sample-users'; 
import { getUserInfo, getAverageSteps, findFriends } from '../src/user';

describe('get user', function() {
    it('should return an object with relevant user data', function() {
        const user = getUserInfo(1, testUsers);

        expect(user.name).to.equal('LeBron James');
        expect(user.address).to.equal('123 Champion Lane, Los Angeles, CA 90001');
        expect(user.email).to.equal('lebron.james@example.com');
        expect(user.strideLength).to.equal(4.5);
        expect(user.dailyStepGoal).to.equal(10000);
        expect(user.friends).to.deep.equal([2, 3, 4, 5]);
    });
});

describe('get average step goal', function() {
    it('should get average steps amongst all users', function() {
        const averageSteps = getAverageSteps(testUsers);
        
        expect(averageSteps).to.equal(10800);
    });
});

describe('find user friends', function() {
    it('should return an array of friend\'s names', function() {
        const user = getUserInfo(1, testUsers);
        const usersFriends = findFriends(user.id, testUsers);

        expect(usersFriends).to.deep.equal(['Serena Williams', 'Cristiano Ronaldo', 'Simone Biles', 'Usain Bolt']);
    });
});