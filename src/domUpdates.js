import { getUserInfo, getAverageSteps, findFriends } from './user';
import { calculateAverageIntake, findIntakeByDay, findIntakeWeek } from './hydration'; 
import { calculateAvgHoursSlept, calculateAvgSleepQuality, findSleepHourDay, findSleepQualityDay, findHoursSleptWeek, findSleepQualityWeek } from './sleep';
import { allData, fetchData } from './apiCalls'

//QUERY SELECTORS
const nameDisplay = document.querySelector('h1')
const address = document.querySelector('#address')
const email = document.querySelector('#email')
const todayInfo = document.querySelector('h3')
const hydrationWeek = document.querySelector('#hydro-week')
const friendsList = document.querySelector('#friends')
const sleepHours = document.querySelector('#sleep-hours')
const sleepQuality = document.querySelector('#sleep-quality')
const avg = document.querySelector('#avgs')
const richard = document.querySelector('#richard-img')
const steps = document.querySelector('#steps')
const button = document.querySelector('button')
// const hydroGraph = document.querySelector('#hydro-graph');
// const sleepQualityGraph = document.querySelector('#sleep-q-graph');
// const hoursSleptGraph = document.querySelector('#sleep-graph');
// const modeButton = document.querySelector('.mode');
// const modeLabel = document.querySelector('#mode-label');

//EVENT LISTENERS
window.addEventListener('load', renderDom);
button.addEventListener('mouseover', animateRichard);
// modeButton.addEventListener('click', displayGraphs);


// FUNCTIONS
function renderDom(){
  fetchData()
    .then(([info, sleep, hydration]) => {
      const randomUser = getUserInfo(Math.floor(Math.random() * info.users.length), info.users);
      displayPersonalInfo(randomUser);
      displayTodayInfo(randomUser, sleep.sleepData, hydration.hydrationData)
      displayHydrationInfo(randomUser, hydration.hydrationData);    
      displayFriends(randomUser, info.users);
      displaySleepInfo(randomUser, sleep.sleepData);
      displayStepInfo(randomUser, info.users)
      displayAverages(randomUser, sleep.sleepData, hydration.hydrationData)
    })
}

function displayPersonalInfo(person) {
  nameDisplay.innerText = person.name;
  address.innerHTML = `${formatAddress(person.address)}` 
  email.innerHTML = `${person.email}` 
}

function displayFriends(person, dataSet) {
  const friends = findFriends(person.id, dataSet)
  friends.forEach((friend, index) => {
    if (!index) {
      friendsList.innerHTML = friend;
    } else {
      friendsList.innerHTML += `<br></br>${friend}</span>`
    }
  })
}

function displayTodayInfo(person, sleepDataSet, hydrationDataSet) {
  const today = sleepDataSet.filter((entry) => {
    return entry.userID === person.id
  }).slice(-1)[0].date
  const ouncesDrank = findIntakeByDay(person.id, today, hydrationDataSet)
  const todayHoursSlept = findSleepHourDay(person.id, today, sleepDataSet)
  const sleepQualityDay = findSleepQualityDay(person.id, today, sleepDataSet)
  todayInfo.innerText = `Today you drank ${ouncesDrank} ounces of water and slept ${todayHoursSlept} hours with a sleep quality of ${sleepQualityDay} out of 5!`
}

function displayHydrationInfo(person, dataSet) {
  const dailyInfo = findIntakeWeek(person.id, dataSet)
  // createBarGraph(dailyInfo, 'hydration')
  dailyInfo.forEach((day, index) => {
    if(!index) {
      hydrationWeek.innerHTML += `<br></br><span class="today-span">TODAY: ${day.numOunces} ounces`
    } else {
      hydrationWeek.innerHTML += `<br></br>${formatDate(day.date)}: ${day.numOunces} ounces`
    }
  })
}

function displaySleepInfo(person, dataSet) {
  let today = dataSet.filter((entry) => {
    return entry.userID === person.id
  }).slice(-1)[0].date
  let weeklySleepQuality = findSleepQualityWeek(person.id, today, dataSet)
  let weeklyHoursSlept = findHoursSleptWeek(person.id, today, dataSet)
  // createBarGraph(weeklySleepQuality, 'sleep quality')
  // createBarGraph(weeklyHoursSlept, 'hoursSlept')
  weeklyHoursSlept.forEach((day, index) => {
    if(!index){
      sleepHours.innerHTML += `<br></br><span class="today-span">TODAY: ${day.hoursSlept} hours</span>`
    } else {
      sleepHours.innerHTML += `<br></br>${formatDate(day.date)}: ${day.hoursSlept} hours`
    }
  })
  weeklySleepQuality.forEach((day, index) => {
    if(!index){
      sleepQuality.innerHTML += `<br></br><span class="today-span">TODAY: ${day.sleepQuality} out of 5`
    } else {
      sleepQuality.innerHTML += `<br></br>${formatDate(day.date)}: ${day.sleepQuality} out of 5`
    }
  })
}

function displayAverages(person, sleepDataSet, hydrationDataSet) {
  let avgSleepQuality = calculateAvgSleepQuality(person.id, sleepDataSet)
  let avgSleepHours = calculateAvgHoursSlept(person.id, sleepDataSet)
  let averageIntake = calculateAverageIntake(person.id, hydrationDataSet)
  avg.innerHTML = `Hours Slept: ${avgSleepHours}<br></br>Sleep Quality: ${avgSleepQuality} out of 5<br></br>Water Intake: ${averageIntake} Ounces`
}

function displayStepInfo(person, dataSet) {
  let averageSteps = getAverageSteps(dataSet);
  let message;
  let differenceInSteps = Math.abs(averageSteps - person.dailyStepGoal); 
  if(averageSteps > person.dailyStepGoal) {
    message = `Your step goal was ${differenceInSteps} steps less than the average.`
  } else if (averageSteps < person.dailyStepGoal){
    message = `Your step goal was ${differenceInSteps} steps more than the average!`
  } else {
    message = `Your step goal was equal to the average, congrats!`
  }
  steps.innerHTML = `Stride Length: ${person.strideLength}<br></br>Daily Step Goal: ${person.dailyStepGoal}<br></br>${message}`
}

function formatDate(date) {
  return date.split('').splice(5).join('')
}

function formatAddress(addressInfo) {
  let splitAddress = addressInfo.split(', ');
  let [addrLine1, addrLine2] = splitAddress;
  return `${addrLine1}<br></br>${addrLine2}`
};

function animateRichard() {
    richard.innerHTML = '<img src="./images/richard-animation-3.png" alt="richard-waving"></img>'
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

// function displayGraphs() {
//   hydrationWeek.classList.add('hidden');
//   sleepHours.classList.add('hidden');
//   sleepQuality.classList.add('hidden');
//   hydroGraph.classList.remove('hidden');
//   sleepQualityGraph.classList.remove('hidden');
//   hoursSleptGraph.classList.remove('hidden');
//   // modeLabel.innerText = 'Switch to Text Mode';
//   // modeLabel.className = 'text-mode';
// }

// function createBarGraph(dataSet, dataCategory) {
//   const days = [];

//   if(dataCategory === 'hydration') {
//     dataSet.forEach((day) => { 
//       days.push({date: day.date, data: day.numOunces});
//     })
//     hydroGraph.innerHTML = '';
//     days.forEach(day => {
//       const dayContainer = document.createElement('div');
//       dayContainer.className = 'day-container';
//       const barContainer = document.createElement('div');
//       barContainer.className = 'bar-container';
//       // barContainer.style.height = `${20}vh`;
//       const bar = document.createElement('div');
//       bar.className = 'bar';
//       bar.style.height = `${(day.data / 100) * 20}vh`;
//       const dayLabel = document.createElement('p')
//       dayLabel.className = 'day-label';
//       dayLabel.innerText = `${day.date.slice(5)}`;
//       hydroGraph.appendChild(dayContainer);
//       dayContainer.appendChild(barContainer);
//       barContainer.appendChild(bar);
//       dayContainer.appendChild(dayLabel);
//     });
//   } else if(dataCategory === 'sleep quality') {
//       dataSet.forEach((day) => { 
//         days.push({date: day.date, data: day.sleepQuality})
//       })
//       sleepQualityGraph.innerHTML = '';
//       days.forEach(day => {
//         const dayContainer = document.createElement('div');
//         dayContainer.className = 'day-container';
//         const barContainer = document.createElement('div');
//         barContainer.className = 'bar-container';
//         // barContainer.style.height = `${20}vh`;
//         const bar = document.createElement('div');
//         bar.className = 'bar';
//         bar.style.height = `${(day.data / 5) * 20}vh`;
//         const dayLabel = document.createElement('p');
//         dayLabel.className = 'day-label';
//         dayLabel.innerText = `${day.date.slice(5)}`;
//         sleepQualityGraph.appendChild(dayContainer);
//         dayContainer.appendChild(barContainer)
//         barContainer.appendChild(bar);
//         dayContainer.appendChild(dayLabel);
//       });
//   } else {
//       dataSet.forEach((day) => { 
//         days.push({date: day.date, data: day.hoursSlept})
//       });
//       hoursSleptGraph.innerHTML = '';
//       days.forEach(day => {
//         const dayContainer = document.createElement('div');
//         dayContainer.className = 'day-container';
//         const barContainer = document.createElement('div');
//         barContainer.className = 'bar-container';
//         // barContainer.style.height = `${20}vh`;
//         const bar = document.createElement('div');
//         bar.className = 'bar';
//         bar.style.height = `${(day.data / 12) * 20}vh`;
//         const dayLabel = document.createElement('p');
//         dayLabel.className = 'day-label';
//         dayLabel.innerText = `${day.date.slice(5)}`;
//         hoursSleptGraph.appendChild(dayContainer);
//         dayContainer.appendChild(barContainer)
//         barContainer.appendChild(bar);
//         dayContainer.appendChild(dayLabel);
//       });
//    };
// };