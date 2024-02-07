import { getUserInfo, getAverageSteps } from './user';
import { calculateAverageIntake, findIntakeByDay, findIntakeWeek } from './hydration'; 
import { allData, fetchData } from './apiCalls'

//QUERY SELECTORS
const nameDisplay = document.querySelector('h1')
const addressEmail = document.querySelector('#address-email')
const stepsStride = document.querySelector('#steps-stride')
const averageStepDisplay = document.querySelector('h3')
const hydrationWeek = document.querySelector('#hydro-week')

function renderDom(){
  fetchData()

    .then(([info, sleep, hydration]) => {
      const randomUser = getUserInfo(Math.floor(Math.random() * info.users.length), info.users)
      users = info.users
      displayPersonalInfo(randomUser)
      displayStepComparison(randomUser)
      getAverageSteps(info.users)
      displayHydrationInfo(randomUser.id, hydration.hydrationData)
      findIntakeWeek(randomUser, hydration.hydrationData)
    }
    )
}

//EVENT LISTENERS
window.addEventListener('load', renderDom)

let users = [];

// FUNCTIONS
function displayPersonalInfo(randomUser) {
  nameDisplay.innerText = randomUser.name;
  addressEmail.innerHTML = `${randomUser.address} <br></br> ${randomUser.email}` 
  stepsStride.innerHTML = `Stride Length: ${randomUser.strideLength}<br></br>Daily Step Goal: ${randomUser.dailyStepGoal}` 
}

function displayStepComparison(randomUser) {
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
  const todayInfo = findIntakeWeek(randomUser.id, hydrationData.hydrationData)
  hydrationWeek.innerHTML = `Today: ${todayInfo[0].numOunces} ounces`
  for (var i = 1; i < todayInfo.length; i++) {
    hydrationWeek.innerHTML += `<br></br>${todayInfo[i].date}: ${todayInfo[i].numOunces} ounces`
  }
}

