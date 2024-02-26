import { expect } from 'chai';
import { testSleepData } from '../src/data/sample-sleep'; 
import { calculateAvgSleepData, findSleepDayInfo, findSleepInfoWeek } from '../src/sleep'; 

describe('sleep-test.js', function() { 
  describe('calculate sleep hours or sleep quality average', function() {
    it('should calculate the user’s average number of hours slept or sleep quality per day', function() {
      const user1HoursAvg = calculateAvgSleepData(1, testSleepData, 'hoursSlept');
      const user2HoursAvg = calculateAvgSleepData(2, testSleepData, 'hoursSlept');
      const user1QualityAvg = calculateAvgSleepData(1, testSleepData, 'sleepQuality');
      const user2QualityAvg = calculateAvgSleepData(2, testSleepData, 'sleepQuality');

      expect(user1HoursAvg).to.equal('7.03');
      expect(user2HoursAvg).to.equal('8.34');
      expect(user1QualityAvg).to.equal('3.53');
      expect(user2QualityAvg).to.equal('3.01');
    });

    it('should return a message if the user is new', function(){
      const user3Avg = calculateAvgSleepData(3, testSleepData, 'hoursSlept');

      expect(user3Avg).to.equal(`You do not have any data yet.`)
    })
  });

  describe('get hours slept or sleep quality for a day', function() {
    it('should return how many hours a user slept or sleep quality for a specific day', function() {
      const user1Hours = findSleepDayInfo(1, "2023/03/24", testSleepData, 'hoursSlept');
      const user2Hours = findSleepDayInfo(2, "2023/03/25", testSleepData, 'hoursSlept');
      const user1Quality = findSleepDayInfo(1, "2023/03/24", testSleepData, 'sleepQuality');
      const user2Quality = findSleepDayInfo(2, "2023/03/25", testSleepData, 'sleepQuality');

      expect(user1Hours).to.equal(9.6);
      expect(user2Hours).to.equal(8.1);
      expect(user1Quality).to.equal(4.3);
      expect(user2Quality).to.equal(4.7);
    });

    it('should return a message if there is no entry for the day in question', function() {
      const user1Data = findSleepDayInfo(1, "2024/1/24", testSleepData, 'hoursSlept');

      expect(user1Data).to.equal(`There is no entry for the date provided.`);
    });
  });

  describe('get sleep information for a week', function() {
    it('should return users sleep information for a specific week', function() {
      const user1Data = findSleepInfoWeek(1, "2023/03/31", testSleepData);
      const user2Data = findSleepInfoWeek(2, "2023/03/30", testSleepData);
  
      expect(user1Data.length).to.equal(7);

      expect(user1Data[5]).to.deep.equal({
        "userID": 1,
        "date": "2023/03/26",
        "hoursSlept": 7.1,
        "sleepQuality": 4.7
      });
      expect(user2Data[1]).to.deep.equal({
        "userID": 2,
        "date": "2023/03/29",
        "hoursSlept": 4.3,
        "sleepQuality": 2.2
    });
  });

    it('should return partial data if there are not entries for the entire week', function() {
      const user1Data = findSleepInfoWeek(1, "2023/03/26", testSleepData);

      expect(user1Data.length).to.equal(3);
    });

    it('should return message if there are no entries for the entire week', function() {
      const user1Data = findSleepInfoWeek(1, "2024/01/25", testSleepData);

      expect(user1Data).to.equal(`There are no entries for the week provided.`);
    });
  });
});





