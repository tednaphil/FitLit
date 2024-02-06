import { getUserInfo, getAverageSteps } from '../src/user-info';
import userData from './data/users'; 
const users = userData.users

//QUERY SELECTORS
const nameDisplay = document.querySelector('h1')
const addressEmail = document.querySelector('#address-email')
const stepsStride = document.querySelector('#steps-stride')
const averageStepDisplay = document.querySelector('h3')

//GLOBAL VARIABLES
const randomUser = getUserInfo(Math.floor(Math.random() * users.length), users)

//EVENT LISTENERS
window.addEventListener('load', displayUserInfo)

//FUNCTIONS
function displayUserInfo() {
  displayPersonalInfo();
  displayStepComparison();
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
