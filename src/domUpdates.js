import { getUserInfo, getAverageSteps } from './user';
import { calculateAverageIntake, findIntakeByDay, findIntakeWeek } from './hydration';
// import hydrationData from './data/hydration'; 
// import userData from './data/users'; 
// const users = userData.users
import { getData } from './apiCalls';
// import users from './apiCalls';
// console.log('users: ', users)


//QUERY SELECTORS
const nameDisplay = document.querySelector('h1')
const addressEmail = document.querySelector('#address-email')
const stepsStride = document.querySelector('#steps-stride')
const averageStepDisplay = document.querySelector('h3')
const hydrationWeek = document.querySelector('#hydro-week')


//GLOBAL VARIABLES
// const randomUser = getUserInfo(Math.floor(Math.random() * users.length), users)
// console.log(randomUser)

let users = null
let randomUser = null
let hydrationData = null

//EVENT LISTENERS
getData()
  .then(data => displayAllInfo(data))

// window.addEventListener('load', displayAllInfo)

//fetch all data from promise all then invoke display all info with data argument instead of
//event listener?

//FUNCTIONS

function getRandomUser(users) {
  return getUserInfo(Math.floor(Math.random() * users.length), users)
}

function displayAllInfo(data) {
  users = data.users
  // console.log(data)
  hydrationData = data.hydrationData
  randomUser = getRandomUser(data.users)
  displayPersonalInfo();
  displayStepComparison();
  displayHydrationInfo();
}

function displayPersonalInfo() {
  nameDisplay.innerText = randomUser.name;
  addressEmail.innerHTML = `${randomUser.address} <br></br> ${randomUser.email}` 
  stepsStride.innerHTML = `Stride Length: ${randomUser.strideLength}<br></br>Daily Step Goal: ${randomUser.dailyStepGoal}` 
}

function displayStepComparison() {
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

function displayHydrationInfo() {
  //should we store the invokation of findIntakeByDay in a variable for today's info to display
  //then store the weeks info in a different variable to display?
  const todayInfo = findIntakeWeek(randomUser.id, hydrationData);
  hydrationWeek.innerHTML = `Today: ${todayInfo[0].numOunces} ounces`;
  todayInfo.shift();
  // console.log('week Info minus today: ', todayInfo)
  todayInfo.forEach((day) => {
    hydrationWeek.innerHTML += `<br></br>${day.date}: ${day.numOunces} ounces`
  });
};

