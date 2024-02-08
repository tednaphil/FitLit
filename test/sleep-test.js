import { expect } from 'chai';
import { testSleepData } from '../src/data/sample-sleep'; 
import { calculateAverageHoursSlept } from '../src/sleep'; 

describe('get user', function() {
  it('should be a function', function() {
      expect(calculateAverageHoursSlept).to.be.a("function")
  })

  it('should calculate the user’s average number of hours slept per day', function() {
      const user1Avg = calculateAverageHoursSlept(1, testSleepData)
      const user2Avg = calculateAverageHoursSlept(2, testSleepData)

      expect(user1Avg).to.equal(7.025)
      expect(user2Avg).to.equal(8.3375)
  })
})


// {
//   "userID": 1,
//   "date": "2023/03/24",
//   "hoursSlept": 9.6,
//   "sleepQuality": 4.3
// },

// Sleep Data
// You should create functions that:

// Return the user’s average number of hours slept per day
// Return the user’s average sleep quality per day over all time
// Return how many hours a user slept for a specific day
// Return a user’s sleep quality for a specific day
// Return how many hours a user slept each day over the course of a given week (7 days)
// This function should be able to calculate this for any week, not just the latest week
// Return a user’s sleep quality for each day over the course of a given week (7 days)
// this function should be able to calculate this for any week, not just the latest week
// User Stories (Dashboard)
