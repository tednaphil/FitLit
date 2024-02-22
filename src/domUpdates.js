import { getUserInfo, getAverageSteps, findFriends } from './user';
import { calculateAverageIntake, findIntakeByDay, findIntakeWeek } from './hydration'; 
import { calculateAvgSleepData, findSleepDayInfo, findSleepInfoWeek } from './sleep';
import { fetchData, runPost } from './apiCalls';

//QUERY SELECTORS
const main = document.querySelector('main');
const header = document.querySelector('header');
const errorDisplay = document.querySelector('.error-display');
const nameDisplay = document.querySelector('h1');
const address = document.querySelector('#address');
const email = document.querySelector('#email');
const todayInfo = document.querySelector('h3');
const hydrationWeek = document.querySelector('#hydro-week');
const friendsList = document.querySelector('#friends');
const sleepHours = document.querySelector('#sleep-hours');
const sleepQuality = document.querySelector('#sleep-quality');
const avg = document.querySelector('#avgs');
const steps = document.querySelector('#steps');
const hydroGraph = document.querySelector('#hydro-graph');
const sleepQualityGraph = document.querySelector('#sleep-q-graph');
const hoursSleptGraph = document.querySelector('#sleep-graph');
const hydroButton = document.querySelector('#hydro-button');
const hoursButton = document.querySelector('#hours-button');
const qualityButton = document.querySelector('#quality-button');
const hydroTitle = document.querySelector('#hy-title');
const qualityTitle = document.querySelector('#q-title');
const hoursTitle = document.querySelector('#ho-title');
const formInfo = document.querySelector('form')
const hydroField = document.querySelector('.hydro-field');
const hoursField = document.querySelector('.hours-field');
const qualityField = document.querySelector('.quality-field')
const infoButton = document.querySelector('.info-button')

//EVENT LISTENERS
window.addEventListener('load', renderDom);

infoButton.addEventListener('click', function() {
  formInfo.classList.toggle('hidden')
  main.classList.toggle('hidden')
  if (infoButton.innerText === "Enter Today's Info!") {
    infoButton.innerText = "Back to Home Page"
  } else {
    infoButton.innerText = "Enter Today's Info!"
  }
})

formInfo.addEventListener('submit', function(event) {
  event.preventDefault();
  formInfo.classList.add('hidden')
  main.classList.remove('hidden')
  if (!submittedTodaysData) {
    submittedTodaysData = true;
    return Promise.all(runPost(randomUser.id, hydroField, hoursField, qualityField))
    .then(res => {
      renderDom()
    })
    .catch(error => {
      setTimeout(() => {
        alert(error)
        }, 1050)
      displayErrorMessage(error)
      return error; 
    })
  } else {
    alert('Oops! You have already submitted info for today.');
  }
  clearInputFields();
})
 
hydroButton.addEventListener('click', function() {
  toggleGraph('hydration');
});
hoursButton.addEventListener('click', function() {
  toggleGraph('hours slept');
});
qualityButton.addEventListener('click', function() {
  toggleGraph('sleep quality');
});

// GLOBAL VARIABLES
let displayingHydroGraph = false;
let displayingHoursGraph = false;
let displayingQualityGraph = false;
let submittedTodaysData = false;

var randomUser;

// FUNCTIONS
function renderDom(){
  fetchData()
    .then(([info, sleep, hydration]) => {
      if(!randomUser){
        randomUser = getUserInfo(Math.floor(Math.random() * info.users.length), info.users);
      }
      displayPersonalInfo(randomUser);
      displayTodayInfo(randomUser, sleep.sleepData, hydration.hydrationData);
      displayHydrationInfo(randomUser, hydration.hydrationData);    
      displayFriends(randomUser, info.users);
      displaySleepInfo(randomUser, sleep.sleepData);
      displayStepInfo(randomUser, info.users);
      displayAverages(randomUser, sleep.sleepData, hydration.hydrationData);
      clearInputFields();  
    })
    .catch(error => {
      displayErrorMessage(error);
    })
};

function clearInputFields(){
  formInfo.value = '';
  hydroField.value = '';
  hoursField.value = '';
  qualityField.value = '';
}

function displayErrorMessage(error) {
  main.classList.add('hidden');
  header.classList.add('hidden');
  errorDisplay.classList.remove('hidden');
};

function displayPersonalInfo(person) {
  nameDisplay.innerText = person.name;
  address.innerHTML = `${formatAddress(person.address)}`;
  email.innerHTML = `${person.email}`;
};

function displayFriends(person, dataSet) {
  const friends = findFriends(person.id, dataSet)
  friends.forEach((friend, index) => {
    if (!index) {
      friendsList.innerHTML = friend;
    } else {
      friendsList.innerHTML += `<br></br>${friend}</span>`;
    };
  });
};

function displayTodayInfo(person, sleepDataSet, hydrationDataSet) {
  const today = sleepDataSet.filter((entry) => {
    return entry.userID === person.id;
  }).slice(-1)[0].date;
  const ouncesDrank = findIntakeByDay(person.id, today, hydrationDataSet);
  const todayHoursSlept = findSleepDayInfo(person.id, today, sleepDataSet, "hoursSlept");
  const sleepQualityDay = findSleepDayInfo(person.id, today, sleepDataSet, "sleepQuality");
  todayInfo.innerText = `Today you drank ${ouncesDrank} ounces of water and slept ${todayHoursSlept} hours with a sleep quality of ${sleepQualityDay} out of 5!`;
};

function displayHydrationInfo(person, dataSet) {
  const dailyInfo = findIntakeWeek(person.id, dataSet);

  createBarGraph(dailyInfo, 'hydration');
  dailyInfo.forEach((day, index) => {
    if(!index) {
      hydrationWeek.innerHTML = '';
      hydrationWeek.innerHTML += `<br></br><span class="today-span">TODAY: ${day.numOunces} ounces`;
    } else {
      hydrationWeek.innerHTML += `<br></br>${formatDate(day.date)}: ${day.numOunces} ounces`;
    };
  });
};

function displayAverages(person, sleepDataSet, hydrationDataSet) {
  let avgSleepQuality = calculateAvgSleepData(person.id, sleepDataSet, 'sleepQuality');
  let avgSleepHours = calculateAvgSleepData(person.id, sleepDataSet, 'hoursSlept');
  let avgIntake = calculateAverageIntake(person.id, hydrationDataSet);
  avg.innerHTML = '';
  avg.innerHTML += `Hours Slept: ${avgSleepHours}<br></br>Sleep Quality: ${avgSleepQuality} out of 5<br></br>Water Intake: ${avgIntake} Ounces`
};

function displaySleepInfo(person, dataSet) {
  let today = dataSet.filter((entry) => {
    return entry.userID === person.id;
  }).slice(-1)[0].date;
  let weeklySleepInfo = findSleepInfoWeek(person.id, today, dataSet);

  createBarGraph(weeklySleepInfo, 'sleep quality');
  createBarGraph(weeklySleepInfo, 'hoursSlept');
  weeklySleepInfo.forEach((day, index) => {
    if(!index){
      sleepHours.innerHTML = '';
      sleepHours.innerHTML += `<br></br><span class="today-span">TODAY: ${day.hoursSlept} hours</span>`;
    } else {
      sleepHours.innerHTML += `<br></br>${formatDate(day.date)}: ${day.hoursSlept} hours`;
    };
  });
  weeklySleepInfo.forEach((day, index) => {
    if(!index){
      sleepQuality.innerHTML = '';
      sleepQuality.innerHTML += `<br></br><span class="today-span">TODAY: ${day.sleepQuality} out of 5`;
    } else {
      sleepQuality.innerHTML += `<br></br>${formatDate(day.date)}: ${day.sleepQuality} out of 5`;
    };
  });
};

function displayStepInfo(person, dataSet) {
  let averageSteps = getAverageSteps(dataSet);
  let message;
  let differenceInSteps = Math.abs(averageSteps - person.dailyStepGoal);

  if(averageSteps > person.dailyStepGoal) {
    message = `Your step goal was ${differenceInSteps} steps less than the average.`;
  } else if (averageSteps < person.dailyStepGoal){
    message = `Your step goal was ${differenceInSteps} steps more than the average!`;
  } else {
    message = `Your step goal was equal to the average.`;
  }
  steps.innerHTML = `Stride Length: ${person.strideLength}<br></br>Daily Step Goal: ${person.dailyStepGoal}<br></br>${message}`;
};

function formatDate(date) {
  return date.split('').splice(5).join('');
};

function formatAddress(addressInfo) {
  let splitAddress = addressInfo.split(', ');
  let [addrLine1, addrLine2] = splitAddress;

  return `${addrLine1}<br></br>${addrLine2}`;
};

function createBarGraph(dataSet, dataCategory) {
  dataSet.forEach(day => {
    const dayContainer = document.createElement('div');
    dayContainer.className = 'day-container';
    const barContainer = document.createElement('div');
    barContainer.className = 'bar-container';
    const bar = document.createElement('div');
    bar.className = 'bar';
    const dayLabel = document.createElement('p');
    dayLabel.className = 'day-label';
    dayContainer.appendChild(barContainer);
    barContainer.appendChild(bar);
    dayContainer.appendChild(dayLabel);
    dayLabel.innerText = `${day.date.slice(5)}`;
    if(dataCategory === 'hydration') {
      bar.style.height = `${(day.numOunces / 100) * 20}vh`;
      hydroGraph.appendChild(dayContainer);
    } else if(dataCategory === 'sleep quality') {
        bar.style.height = `${(day.sleepQuality / 5) * 20}vh`;
        sleepQualityGraph.appendChild(dayContainer);
    } else {
      bar.style.height = `${(day.hoursSlept / 12) * 20}vh`;
      hoursSleptGraph.appendChild(dayContainer);
    };
  });
};

function toggleGraph(category) {
  let graphURL = "./images/graph-icon.png";
  let textURL = "./images/txt-icon.png";

  if(category === 'hydration'){
    hydrationWeek.classList.toggle('hidden');
    hydroGraph.classList.toggle('hidden');
    hydroTitle.classList.toggle('hidden');
    if(!displayingHydroGraph) {
      hydroButton.src = textURL;
    } else {
      hydroButton.src = graphURL;
    };
    displayingHydroGraph = !displayingHydroGraph;
  } else if (category === 'sleep quality') {
    sleepQuality.classList.toggle('hidden');
    sleepQualityGraph.classList.toggle('hidden');
    qualityTitle.classList.toggle('hidden');
    if(!displayingQualityGraph) {
      qualityButton.src = textURL;
    } else {
      qualityButton.src = graphURL;
    };
    displayingQualityGraph = !displayingQualityGraph;
  } else {
    sleepHours.classList.toggle('hidden');
    hoursSleptGraph.classList.toggle('hidden');
    hoursTitle.classList.toggle('hidden');
    if(!displayingHoursGraph) {
      hoursButton.src = textURL;
    } else {
      hoursButton.src = graphURL;
    };
    displayingHoursGraph = !displayingHoursGraph;
  };
};