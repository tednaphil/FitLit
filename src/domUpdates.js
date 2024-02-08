import { getUserInfo, getAverageSteps, findFriends } from './user';
import { calculateAverageIntake, findIntakeByDay, findIntakeWeek } from './hydration'; 
import { calculateAvgHoursSlept, calculateAvgSleepQuality, findSleepHourDay, findSleepQualityDay, findHoursSleptWeek, findSleepQualityWeek } from './sleep';
import { allData, fetchData } from './apiCalls'

//QUERY SELECTORS
const nameDisplay = document.querySelector('h1')
const addressEmail = document.querySelector('#address-email')
const stepsStride = document.querySelector('#steps-stride')
const averageStepDisplay = document.querySelector('h3')
const hydrationWeek = document.querySelector('#hydro-week')
const friendsList = document.querySelector('#friends')
const sleepHours = document.querySelector('#sleep-hours')
const sleepQuality = document.querySelector('#sleep-quality')
const avgSleep = document.querySelector('#avg-sleep')

//EVENT LISTENERS
window.addEventListener('load', renderDom)

// FUNCTIONS
function renderDom(){
  fetchData()
    .then(([info, sleep, hydration]) => {
      const randomUser = getUserInfo(Math.floor(Math.random() * info.users.length), info.users);
      displayPersonalInfo(randomUser);
      displayStepComparison(randomUser, info.users);
      displayHydrationInfo(randomUser, hydration.hydrationData);    
      displayFriends(randomUser, info.users);
      displaySleepInfo(randomUser, sleep.sleepData);
    })
}

function displayPersonalInfo(randomUser) {
  nameDisplay.innerText = randomUser.name;
  addressEmail.innerHTML = `${randomUser.address} <br></br> ${randomUser.email}` 
  stepsStride.innerHTML = `Stride Length: ${randomUser.strideLength}<br></br>Daily Step Goal: ${randomUser.dailyStepGoal}` 
}

function displayFriends(person, people) {
  const friends = findFriends(person.id, people)
  friends.forEach((friend, index) => {
    if (!index) {
      friendsList.innerHTML = friend;
    } else {
      friendsList.innerHTML += `<br></br>${friend}`
    }
  })
}

function displayStepComparison(randomUser, users) {
  let averageSteps = getAverageSteps(users);
  let differenceInSteps = Math.abs(averageSteps - randomUser.dailyStepGoal); 
  if(averageSteps > randomUser.dailyStepGoal) {
    averageStepDisplay.innerText = `Your step goal was ${differenceInSteps} steps less than the average.`
  } else if (averageSteps < randomUser.dailyStepGoal){
    averageStepDisplay.innerText = `Your step goal was ${differenceInSteps} steps more than the average!`
  } else {
    averageStepDisplay.innerText = `Your step goal was equal to the average, congrats!`
  }
}

function displayHydrationInfo(randomUser, hydrationData) {
  const dailyInfo = findIntakeWeek(randomUser.id, hydrationData)
  dailyInfo.forEach((day, index) => {
    if(!index) {
      hydrationWeek.innerHTML = `Today: ${day.numOunces} ounces`;
    } else {
      hydrationWeek.innerHTML += `<br></br>${day.date}: ${day.numOunces} ounces`
    }
  })
}

function displaySleepInfo(person, dataSet) {
  let today = dataSet.filter((entry) => {
    return entry.userID === person.id
  }).slice(-1)[0].date
  let avgSleepQuality = calculateAvgSleepQuality(person.id, dataSet)
  let avgSleepHours = calculateAvgHoursSlept(person.id, dataSet)
  let weeklySleepQuality = findSleepQualityWeek(person.id, today, dataSet)
  let weeklyHoursSlept = findHoursSleptWeek(person.id, today, dataSet)
  avgSleep.innerHTML = `Avg Hours Slept: ${avgSleepHours}<br></br>Avg Sleep Quality: ${avgSleepQuality}/5`
  weeklyHoursSlept.forEach((day, index) => {
    if(!index) {
      sleepHours.innerHTML = `Today: ${day.hoursSlept} hours`;
    } else {
      sleepHours.innerHTML += `<br></br>${day.date}: ${day.hoursSlept} hours`
    }
  })
  weeklySleepQuality.forEach((day, index) => {
    if(!index) {
      sleepQuality.innerHTML = `Today: ${day.sleepQuality}/5`;
    } else {
      sleepQuality.innerHTML += `<br></br>${day.date}: ${day.sleepQuality}/5`
    }
  })
};

