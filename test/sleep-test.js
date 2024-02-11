import { expect } from 'chai';
import { testSleepData } from '../src/data/sample-sleep'; 
import { calculateAvgHoursSlept, calculateAvgSleepQuality, findSleepHourDay, findSleepQualityDay, findHoursSleptWeek, findSleepQualityWeek } from '../src/sleep'; 

describe('calculate sleep hours average', function() {
  it('should be a function', function() {
      expect(calculateAvgHoursSlept).to.be.a("function");
  });

  it('should calculate the user’s average number of hours slept per day', function() {
      const user1Avg = calculateAvgHoursSlept(1, testSleepData);
      const user2Avg = calculateAvgHoursSlept(2, testSleepData);

      expect(user1Avg).to.equal('7.03');
      expect(user2Avg).to.equal('8.34');
  });
});

describe('calculate sleep quality average', function() {
  it('should be a function', function() {
      expect(calculateAvgSleepQuality).to.be.a("function");
  });

  it('should calculate the user’s average sleep quality per day over all time', function() {
      const user1Avg = calculateAvgSleepQuality(1, testSleepData);
      const user2Avg = calculateAvgSleepQuality(2, testSleepData);

      expect(user1Avg).to.equal('3.53');
      expect(user2Avg).to.equal('3.01');
  });
});

describe('get hours slept for a day', function() {
  it('should be a function', function() {
      expect(findSleepHourDay).to.be.a("function");
  });

  it('should return how many hours a user slept for a specific day', function() {
      const user1Data = findSleepHourDay(1, "2023/03/24", testSleepData);
      const user2Data = findSleepHourDay(2, "2023/03/25", testSleepData);

      expect(user1Data).to.equal(9.6);
      expect(user2Data).to.equal(8.1);
  });

  it('should return a message if there is no entry for the day in question', function() {
    const user1Data = findSleepHourDay(1, "2024/1/24", testSleepData);

    expect(user1Data).to.equal(`There is no entry for the date provided.`);
  });
});

describe('get sleep quality for a day', function() {
  it('should be a function', function() {
      expect(findSleepQualityDay).to.be.a("function");
  });

  it('should return users sleep quality for a specific day', function() {
      const user1Data = findSleepQualityDay(1, "2023/03/24", testSleepData);
      const user2Data = findSleepQualityDay(2, "2023/03/25", testSleepData);

      expect(user1Data).to.equal(4.3);
      expect(user2Data).to.equal(4.7);
  });

  it('should return a message if there is no entry for the day in question', function() {
    const user1Data = findSleepQualityDay(1, "2024/1/24", testSleepData);

    expect(user1Data).to.equal(`There is no entry for the date provided.`);
  });
});

describe('get sleep quality for a day', function() {
  it('should be a function', function() {
      expect(findSleepQualityDay).to.be.a("function");
  });

  it('should return users sleep quality for a specific day', function() {
      const user1Data = findSleepQualityDay(1, "2023/03/24", testSleepData);
      const user2Data = findSleepQualityDay(2, "2023/03/25", testSleepData);

      expect(user1Data).to.equal(4.3);
      expect(user2Data).to.equal(4.7);
  });

  it('should return a message if there is no entry for the day in question', function() {
    const user1Data = findSleepQualityDay(1, "2024/1/24", testSleepData);

    expect(user1Data).to.equal(`There is no entry for the date provided.`);
  });
});

describe('get hours slept for a week', function() {
  it('should be a function', function() {
      expect(findHoursSleptWeek).to.be.a("function");
  });
  
  it('should return users sleep quality for a specific week', function() {
      const user1Data = findHoursSleptWeek(1, "2023/03/31", testSleepData);
      const user2Data = findHoursSleptWeek(2, "2023/03/30", testSleepData);
  
      expect(user1Data.length).to.deep.equal(7);

      expect(user1Data[5]).to.deep.equal({
        "userID": 1,
        "date": "2023/03/26",
        "hoursSlept": 7.1
      });
      expect(user2Data[1]).to.deep.equal({
        "userID": 2,
        "date": "2023/03/29",
        "hoursSlept": 4.3
    });
  });

  it('should return partial data if there are not entries for the entire week', function() {
    const user1Data = findHoursSleptWeek(1, "2023/03/26", testSleepData);

    expect(user1Data.length).to.deep.equal(3);
  });
});

describe('get sleep quality for a week', function() {
  it('should be a function', function() {
      expect(findSleepQualityWeek).to.be.a("function");
  });
  
  it('should return users sleep quality for a specific week', function() {
      const user1Data = findSleepQualityWeek(1, "2023/03/31", testSleepData);
      const user2Data = findSleepQualityWeek(2, "2023/03/30", testSleepData);
  
      expect(user1Data.length).to.deep.equal(7);

      expect(user1Data[5]).to.deep.equal({
        "userID": 1,
        "date": "2023/03/26",
        "sleepQuality": 4.7
      })
      expect(user2Data[1]).to.deep.equal({
        "userID": 2,
        "date": "2023/03/29",
        "sleepQuality": 2.2
    });
  });

  it('should return partial data if there are not entries for the entire week', function() {
    const user1Data = findSleepQualityWeek(1, "2023/03/26", testSleepData);

    expect(user1Data.length).to.deep.equal(3);
  });
});







