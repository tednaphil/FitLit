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
const richard = document.querySelector('.celeb')

//EVENT LISTENERS
window.addEventListener('load', renderDom);
richard.addEventListener('click', animateRichard);

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
      animateRichard();
    })
}

function displayPersonalInfo(person) {
  nameDisplay.innerText = person.name;
  addressEmail.innerHTML = `${person.address} <br></br> ${person.email}` 
  stepsStride.innerHTML = `Stride Length: ${person.strideLength}<br></br>Daily Step Goal: ${person.dailyStepGoal}` 
}

function displayFriends(person, dataSet) {
  const friends = findFriends(person.id, dataSet)
  friends.forEach((friend, index) => {
    if (!index) {
      friendsList.innerHTML = friend;
    } else {
      friendsList.innerHTML += `<br></br>${friend}`
    }
  })
}

function displayStepComparison(person, dataSet) {
  let averageSteps = getAverageSteps(dataSet);
  let differenceInSteps = Math.abs(averageSteps - person.dailyStepGoal); 
  if(averageSteps > person.dailyStepGoal) {
    averageStepDisplay.innerText = `Your step goal was ${differenceInSteps} steps less than the average.`
  } else if (averageSteps < person.dailyStepGoal){
    averageStepDisplay.innerText = `Your step goal was ${differenceInSteps} steps more than the average!`
  } else {
    averageStepDisplay.innerText = `Your step goal was equal to the average, congrats!`
  }
}

function displayHydrationInfo(person, dataSet) {
  const dailyInfo = findIntakeWeek(person.id, dataSet)
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

function animateRichard() {
  //   richard.innerHTML = '<img src="./images/richard-animation-2.png" alt="richard-waving"></img>'
  // setTimeout(function(){
    richard.innerHTML = '<img src="./images/richard-animation-3.png" alt="richard-waving"></img>'
  // }, 200);
  setTimeout(function(){
    richard.innerHTML = '<img src="./images/richard-animation-4.png" alt="richard-waving"></img>'
  }, 100);
  setTimeout(function(){
    richard.innerHTML = '<img src="./images/richard-animation-3.png" alt="richard-waving"></img>'
  }, 200);
  setTimeout(function(){
    richard.innerHTML = '<img src="./images/richard-animation-4.png" alt="richard-waving"></img>'
  }, 300);
  setTimeout(function(){
    richard.innerHTML = '<img src="./images/richard-animation-3.png" alt="richard-waving"></img>'
  }, 400);
  setTimeout(function(){
    richard.innerHTML = '<img src="./images/richard-animation-4.png" alt="richard-waving"></img>'
  }, 500);
  setTimeout(function(){
    richard.innerHTML = '<img src="./images/richard-animation-3.png" alt="richard-waving"></img>'
  }, 600);
  setTimeout(function(){
    richard.innerHTML = '<img src="./images/richard-with-text.png" alt="richard-simmons"></img>'
  }, 700);
  
}