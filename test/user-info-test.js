import { expect } from 'chai';
import { testUsers } from '../src/data/test-data'; 
import { getUserInfo, getAverageSteps } from '../src/user-info';

describe('get user', function() {
    it('should be a function', function() {
        expect(getUserInfo).to.be.a("function")
    })

    it('should return an object with relevant user data', function() {
        const user = getUserInfo(1, testUsers)
        expect(user.name).to.equal('LeBron James')
        expect(user.address).to.equal('123 Champion Lane, Los Angeles, CA 90001')
        expect(user.email).to.equal('lebron.james@example.com')
        expect(user.strideLength).to.equal(4.5)
        expect(user.dailyStepGoal).to.equal(10000)
        expect(user.friends).to.deep.equal([2, 3, 4, 5])
    })
})

describe('get average step goal', function() {
    it('should be a function', function() {
        expect(getAverageSteps).to.be.a("function")
    })

    it('should get average steps amongst all users', function() {
        const averageSteps = getAverageSteps(testUsers)
        expect(averageSteps).to.equal(10800)
    })
})



// {
//     id: 1,
//     name: "LeBron James",
//     address: "123 Champion Lane, Los Angeles, CA 90001",
//     email: "lebron.james@example.com",
//     strideLength: 4.5,
//     dailyStepGoal: 10000,
//     friends: [2, 3, 4, 5]
//   },

