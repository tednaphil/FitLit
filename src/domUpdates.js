import { getUserInfo, getAverageSteps } from '../src/user-info';
import userData from './data/users'; 
const users = userData.users


const nameDisplay = document.querySelector('h1')
const addressEmail = document.querySelector('#address-email')
const stepsStride = document.querySelector('#steps-stride')
const averageStepDisplay = document.querySelector('h3')

const randomUser = getUserInfo(Math.floor(Math.random() * users.length), users)

window.addEventListener('load', console.log('users array: ', users))

function displayUserInfo() {
  displayPersonalInfo();
  displayStepComparison();
}

function displayPersonalInfo() {
  nameDisplay.innerText = randomUser.name;
  addressEmail.innerText = `${randomUser.address} <br></br> ${randomUser.email}` 
  stepsStride.innerText = `${randomUser.strideLength} <br></br> ${randomUser.dailyStepGoal}` 
}

function displayStepComparison() {
  let averageSteps = getAverageSteps(users);
  let differenceInSteps = Math.abs(averageSteps - randomUser.dailyStepGoal); 
  if(averageSteps > randomUser.dailyStepGoal) {
    averageStepDisplay.innerText = `Your step goal was ${differenceInSteps} less than the average.`
  } else if (averageSteps < randomUser.dailyStepGoal){
    averageStepDisplay.innerText = `Your step goal was ${differenceInSteps} more than the average!`
  } else {
    averageStepDisplay.innerText = `Your step goal was equal to the average, congrats!`
  }
}
