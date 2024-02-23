import { getUserInfo, getAverageSteps, findFriends } from './user';
import { calculateAverageIntake, findIntakeByDay, findIntakeWeek } from './hydration'; 
import { calculateAvgSleepData, findSleepDayInfo, findSleepInfoWeek } from './sleep';
import { fetchData, runPost } from './apiCalls';
import Chart from 'chart.js/auto';

//QUERY SELECTORS
const main = document.querySelector('main');
const header = document.querySelector('header');
const errorDisplay = document.querySelector('.error-display');
const nameDisplay = document.querySelector('h1');
const address = document.querySelector('#address');
const email = document.querySelector('#email');
const todayInfo = document.querySelector('h3');
const hydrationWeek = document.querySelector('#hydro-week');
const sleepHours = document.querySelector('#sleep-hours');
const sleepQuality = document.querySelector('#sleep-quality');
const avg = document.querySelector('#avgs');
const steps = document.querySelector('#steps');
// const hydroGraph = document.querySelector('#hydro-graph');
const sleepQualityGraph = document.querySelector('#sleep-q-graph');
const hoursSleptGraph = document.querySelector('#sleep-graph');
const hydroButton = document.querySelector('#hydro-button');
const hoursButton = document.querySelector('#hours-button');
const qualityButton = document.querySelector('#quality-button');
const hydroTitle = document.querySelector('#hy-title');
const qualityTitle = document.querySelector('#q-title');
const hoursTitle = document.querySelector('#ho-title');
const formInfo = document.querySelector('form');
const hydroField = document.querySelector('.hydro-field');
const hoursField = document.querySelector('.hours-field');
const qualityField = document.querySelector('.quality-field');
// const infoButton = document.querySelector('.info-button');
const friendsWidget = document.querySelector('.friends-widget');

const friendSelectors = document.querySelector('#friend-selectors');
const partyButton = document.querySelector('.step-party-button');
const letsPartyButton = document.querySelector('#lets-party');
const partyChartContainer = document.querySelector('#party-chart-container');
const partyChart = document.querySelector('#party-chart');
const footer = document.querySelector('footer')
const hydroChart = document.querySelector('#hydro-chart');
const chartContainer = document.querySelector('#chart-container');

//EVENT LISTENERS
window.addEventListener('load', renderDom);

formInfo.addEventListener('submit', function(event) {
  event.preventDefault();
  if (!submittedTodaysData) {
    submittedTodaysData = true;
    console.log(submittedTodaysData)
    console.log("YESSSS")
    return Promise.all(runPost(randomUser.id, hydroField, hoursField, qualityField))
    .then(res => {
      renderDom()
      clearForm()
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
});
 
hydroButton.addEventListener('click', function() {
  toggleGraph('hydration');
});
hoursButton.addEventListener('click', function() {
  toggleGraph('hours slept');
});
qualityButton.addEventListener('click', function() {
  toggleGraph('sleep quality');
});

partyButton.addEventListener('click', displayFriendSelector);
letsPartyButton.addEventListener('click', generatePartyMode)

// GLOBAL VARIABLES
let displayingHydroGraph = false;
let displayingHoursGraph = false;
let displayingQualityGraph = false;
let submittedTodaysData = false;
let friendsByData = [];

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
      // displayFriends(randomUser, info.users);
      displaySleepInfo(randomUser, sleep.sleepData);
      displayStepInfo(randomUser, info.users);
      displayAverages(randomUser, sleep.sleepData, hydration.hydrationData);
      storeFriends(randomUser, info.users);
      makeFriendSelector(randomUser, info.users)
      clearInputFields()
    })
    // .catch(error => {
    //   displayErrorMessage(error);
    // })
};

function clearForm(){
  footer.classList.add("fade-out")
  setTimeout(() => {
    footer.classList.add("fade-in")
    footer.innerText = "You did it! Congrats on entering your hydration and sleep information for today.";
   }, 2000)
}

function clearInputFields(){
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
  email.innerHTML = `Email:</br>${person.email}`;
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
  if(submittedTodaysData){
    todayInfo.innerText = `Today you drank ${hydroField.value} ounces of water and slept ${hoursField.value} hours with a sleep quality of ${qualityField.value} out of 5!`;
    console.log(hydroField.value)
}  else {
  todayInfo.innerText = `Today you drank ${ouncesDrank} ounces of water and slept ${todayHoursSlept} hours with a sleep quality of ${sleepQualityDay} out of 5!`;
  }
};

function displayHydrationInfo(person, dataSet) {
  const dailyInfo = findIntakeWeek(person.id, dataSet);

  makeChart(dailyInfo, 'hydration');
  // createBarGraph(dailyInfo, 'hydration');
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

  return `Address:</br>${addrLine1},</br>${addrLine2}`;
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
    chartContainer.classList.toggle('hidden');
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

function storeFriends(person, dataSet) {
  let friends = findFriends(person.id, dataSet);
  const friendsData = friends.map((friendName) => {
    return dataSet.find(friend => friendName === friend.name)
  })
  friendsData.push(person);

  friendsByData = friendsData;
};

function makeFriendSelector(){
  friendSelectors.innerHTML = `<h3>Who's In?!<h4>`
  friendsByData.forEach((friend) => {
      friendSelectors.innerHTML +=  `
      <label>
        <input type='radio' name='${friend.name}' id='friend-id-${friend.id}'>${friend.name}
      </label>`
  });
};

function displayFriendSelector() {
  partyButton.classList.add('hidden');
  friendSelectors.classList.remove('hidden');
  friendsWidget.classList.remove('friends-background');
  letsPartyButton.classList.remove('hidden');
}

function makeChart(dataSet, dataCategory) {
  let ctx;
  if (dataCategory === 'hydration'){
    ctx = hydroChart.getContext('2d');
  }
  ctx.canvas.height = chartContainer.style.height;
  const newChart = new Chart(ctx, {
    type: 'bar',
    data: {
      // labels: ['1', '2', '3', '4', '5', '6', '7'],
      datasets: [{
        // data: [8, 5, 7, 9, 6, 6, 8],
        backgroundColor: 'yellow',
        // tension: .1,
        barThickness: 10,
        pointRadius: 0,
        pointBorderColor: 'yellow',
        borderColor: [
          'yellow',
        ],
        borderWidth: 2,
      }]
    },
    options: {
      plugins: {
        legend: {
            display: false,
        }
      },
      scales: {
        y: {
          ticks: {
            padding: 5,
            color: 'yellow',
          },
          // grid: {
          //   display: true,
          //   color: 'lightgrey'
          // },
          title: {
              display: true,
              text: 'num of ounces',
              color: '#FF40AF'
          },
          border: {
            color: '#FF40AF',
            width: 1
          }
        },
        x: {
          ticks: {
            padding: -5,
            color: 'yellow',
            maxRotation: 45,
            minRotation: 45
          },
          title: {
            display: true,
            text: 'day',
            color: '#FF40AF'
        },
          border: {
            color: '#FF40AF',
            width: 1
          }
        }
      }
    },
  })
  newChart.data.labels = dataSet.map((day) => { return day.date.slice(5) });
  newChart.data.datasets[0].data = dataSet.map((day) => { return day.numOunces });
  newChart.options.scales.y.min = 0;
  newChart.options.scales.y.max = 100;
  // hydroChart.style.height = chartContainer.style.height;
  newChart.update();
}

function renderStepChart() {
  let ctx;
  ctx = partyChart.getContext('2d');
  ctx.canvas.height = partyChartContainer.style.height;
  const newChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      // labels: ['1', '2', '3', '4', '5', '6', '7'],
      datasets: [{
        // data: [8, 5, 7, 9, 6, 6, 8],
        backgroundColor: 'yellow',
        // tension: .1,
        barThickness: 10,
        pointRadius: 0,
        pointBorderColor: 'yellow',
        borderColor: [
          'yellow',
        ],
        borderWidth: 2,
      }]
    },
    options: {
      plugins: {
        legend: {
            display: false,
        }
      },
      scales: {
        y: {
          ticks: {
            padding: 5,
            color: 'yellow',
          },
          // grid: {
          //   display: true,
          //   color: 'lightgrey'
          // },
          title: {
              display: true,
              text: 'num of ounces',
              color: '#FF40AF'
          },
          border: {
            color: '#FF40AF',
            width: 1
          }
        },
        x: {
          ticks: {
            padding: -5,
            color: 'yellow',
            maxRotation: 45,
            minRotation: 45
          },
          title: {
            display: true,
            text: 'day',
            color: '#FF40AF'
        },
          border: {
            color: '#FF40AF',
            width: 1
          }
        }
      }
    },
  })
  newChart.data.labels = dataSet.map((day) => { return day.date.slice(5) });
  newChart.data.datasets[0].data = dataSet.map((day) => { return day.numOunces });
  newChart.options.scales.y.min = 0;
  newChart.options.scales.y.max = 100;
  newChart.update();
}

function togglePartyMode() {
  letsPartyButton.innerText = 'Back Home';
  friendSelectors.classList.add('hidden');
  partyChartContainer.classList.remove('hidden');
}


// friendSelector: parent div in which the radios live.
// letsPartyButton has a click event on it




function computePartyMode() {
  let bubbles = friendSelectors.querySelectorAll('input');
  let selectedFriendsFullIds = [];
  bubbles.forEach((bubble) => {
    if(bubble.checked) {
      selectedFriendsFullIds.push(bubble.id);
    }
  });

  let selectedFriendsIds = selectedFriendsFullIds.map((friend) => {
    return parseInt(friend.split('-')[2]);
  })

  let finalSelectedFriendObjects = friendsByData.filter((friend) => {
    return selectedFriendsIds.includes(friend.id);
  })

  finalSelectedFriendObjects.push(randomUser);
}

function generatePartyMode() {
  computePartyMode();
  togglePartyMode()
  renderStepChart();
}