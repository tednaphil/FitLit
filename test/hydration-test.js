import { expect } from 'chai';
import { testHydrationData } from '../src/data/sample-hydration'; 
import { calculateAverageIntake, findIntakeByDay, findIntakeWeek } from '../src/hydration'; 

describe('calculate average intake', function() {
  it('return the user’s average fluid intake for all time', function() {
    const userIntake = calculateAverageIntake(1, testHydrationData);
    
    expect(userIntake).to.equal(53);
  });

  it('should return a message if the user is new', function() {
    const newUser = calculateAverageIntake(4, testHydrationData)

    expect(newUser).to.equal(`You do not have any data yet.`)
  })

});

describe('report intake by day', function() {
  it('return the user’s fluid intake for a specific day', function() {   
    const intake1 = findIntakeByDay(1, "2023/04/01", testHydrationData);
    const intake2 = findIntakeByDay(2, "2023/04/02", testHydrationData);
    
    expect(intake1).to.equal(88);
    expect(intake2).to.equal(64);
  });

  it('should return a message if there is no entry for the day in question', function() {
    const intake1 = findIntakeByDay(1, "2024/1/24", testHydrationData);

    expect(intake1).to.equal(`There is no entry for the date provided.`);
  })
});

describe('report intake by week', function() {
  it('should return information about daily intake over past week', function() {   
    const intake1 = findIntakeWeek(1, testHydrationData);
    const intake2 = findIntakeWeek(2, testHydrationData);

    expect(intake1.length).to.equal(7);
    expect(intake2.length).to.equal(7);

    expect(intake1[3]).to.deep.equal({
      "userID": 1,
      "date": "2023/03/31",
      "numOunces": 51
    });

    expect(intake2[5]).to.deep.equal({
      "userID": 2,
      "date": "2023/03/29",
      "numOunces": 57
    });
  });
  it('should still return partial data if user has less than seven entries', function(){
    const intake3 = findIntakeWeek(3, testHydrationData);

    expect(intake3.length).to.equal(4);
  });
});
