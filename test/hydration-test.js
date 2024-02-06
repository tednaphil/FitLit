import { expect } from 'chai';
import { testHydrationData } from '../src/data/sample-hydration'; 
import { calculateAverageIntake } from '../src/hydration'; 
import { testUsers } from '../src/data/sample-users'; 
import { getUserInfo } from '../src/user'; 

describe('calculate average intake', function() {
  it('should be a function', function() {
    expect(calculateAverageIntake).to.be.a("function")
    });

  it('return the user’s average fluid intake for all time', function() {
    const user1 = getUserInfo(1, testUsers)
    const userIntake = calculateAverageIntake(user1, testHydrationData) 
    
    expect(userIntake).to.equal(53);
  })
    

})






// Hydration Data
// You should create functions that:

// Return the user’s average fluid ounces consumed per day for all time
// Return the user’s fluid ounces they consumed for a specific day
// Return how many fluid ounces of water a user consumed each day over the course of a week (7 days)
// Note
// All functions requiring a specific user’s data should be identified by their userID. Also note that all functions returning data for a specific day should be identified by a date.

// User Stories (Dashboard)
// As a user, I should be able to see how much water I have consumed today (these displays are often called “widgets” in the FE tech world)
// As a user, I should be able to see much water I have consumed each day over the course of the latest week