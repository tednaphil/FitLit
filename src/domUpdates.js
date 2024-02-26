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
const profileButton = document.querySelector('#user-profile-button');
const userProfile = document.querySelector('#user-profile');
const friendsList = document.querySelector('#friends-list');
const addressDisplay = document.querySelector('#address');
const emailDisplay = document.querySelector('#email');
const hydrationWeek = document.querySelector('#hydro-week');
const sleepHoursWeek = document.querySelector('#sleep-hours');
const sleepQualityWeek = document.querySelector('#sleep-quality');
const avg = document.querySelector('#avgs');
const steps = document.querySelector('#steps');
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
const partyWidget = document.querySelector('.party-widget');
const friendSelectors = document.querySelector('#friend-selectors');
const partyButton = document.querySelector('.step-party-button');
const letsPartyButton = document.querySelector('#lets-party');
const todayForm = document.querySelector('.today-form')
const partyResults = document.querySelector('#announce-results');
const firework1 = document.querySelector('.firework-1');
const firework2 = document.querySelector('.firework-2');
const firework3 = document.querySelector('.firework-3');
const hydroChart = document.querySelector('#hydro-chart');
const hydroChartContainer = document.querySelector('#hydro-chart-container');
const qualityChart = document.querySelector('#quality-chart');
const qualityChartContainer = document.querySelector('#quality-chart-container');
const hoursChart = document.querySelector('#hours-chart');
const hoursChartContainer = document.querySelector('#hours-chart-container');

//EVENT LISTENERS
window.addEventListener('load', renderDom)
profileButton.addEventListener('click', changeDisplay);
profileButton.addEventListener('keydown', function(event) {
  if(event.key === "Enter" || event.code === "Space") {
    changeDisplay()
  }
})
formInfo.addEventListener('submit', postFormInput);
partyButton.addEventListener('click', displayFriendSelector);
partyButton.addEventListener('keydown', function(event) {
  if(event.key === "Enter" || event.code === "Space") {
    displayFriendSelector()
  }
})
hydroButton.addEventListener('click', function() {
  toggleGraph('hydration');
});
hoursButton.addEventListener('click', function() {
  toggleGraph('hoursSlept');
});
qualityButton.addEventListener('click', function() {
  toggleGraph('sleepQuality');
});
hydroButton.addEventListener('keydown', function(event) {
  if(event.key === "Enter" || event.code === "Space") {
  toggleGraph('hydration')
  }
});
hoursButton.addEventListener('keydown', function(event) {
  if(event.key === "Enter" || event.code === "Space") {
  toggleGraph('hoursSlept')
  }
});
qualityButton.addEventListener('keydown', function(event) {
  if(event.key === "Enter" || event.code === "Space") {
  toggleGraph('sleepQuality')
  }
});
partyButton.addEventListener('click', function() {
  displayFriendSelector()
});
letsPartyButton.addEventListener('click', function () {
  if (letsPartyButton.innerText === "LET'S PARTY!") {

    generatePartyMode()
    announceStepPartyResult()
  }
  else {
    resetStepParty()
  }
})

// GLOBAL VARIABLES
let displayingHydroGraph = false;
let displayingHoursGraph = false;
let displayingQualityGraph = false;
let friendsByData = [];
let renderedHydroChart;
let renderedHoursChart;
let renderedQualityChart;
let submittedData = false; 
var randomUser;

// FUNCTIONS
function renderDom(){
  fetchData()
    .then(([info, sleep, hydration]) => {
      if(!randomUser){
        randomUser = getUserInfo(Math.floor(Math.random() * info.users.length), info.users);
      }
      displayPersonalInfo(randomUser);
      displayHydrationInfo(randomUser, hydration.hydrationData);    
      displayFriends(randomUser, info.users);
      displaySleepInfo(randomUser, sleep.sleepData);
      displayStepInfo(randomUser, info.users);
      displayAverages(randomUser, sleep.sleepData, hydration.hydrationData);
      storeFriends(randomUser, info.users);
      makeFriendSelector(randomUser, info.users)
      clearInputFields()
    })
    .catch(error => {
      displayErrorMessage(error);
    })
};

function postFormInput(event){
  event.preventDefault();
  submittedData = true; 
  return Promise.all(runPost(randomUser.id, hydroField, hoursField, qualityField))
  .then(responses => {
    if (responses.every(response => response.ok)) {
      return responses
    } else {
      let responseText = responses.find(response => !response.ok).statusText
      let responseCode = responses.find(response => !response.ok).status
      throw new Error(`Failed to Post ${responseCode} - ${responseText} :(`)
    }
  })
  .then(res => {
    renderDom()
    clearForm()
  })
  .catch(error => {
    let errorText = error.message
    console.log('Post Error')
    displayErrorMessage(errorText)
  })
}

function clearForm(){
  todayForm.classList.add("fade-out")
  setTimeout(() => {
    todayForm.classList.add("fade-in")
    todayForm.innerText = "You did it! Congrats on entering your hydration and sleep information for today.";
   }, 1500)
}

function clearInputFields(){
  hydroField.value = '';
  hoursField.value = '';
  qualityField.value = '';
};

function displayErrorMessage(error) {
  main.classList.add('hidden');
  header.classList.add('hidden');
  errorDisplay.classList.remove('hidden');
  errorDisplay.innerText += error;
};

function displayPersonalInfo({name, address, email}) {
  nameDisplay.innerText = name;
  addressDisplay.innerHTML = `${formatAddress(address)}`;
  emailDisplay.innerText = email; 
};

function displayFriends({id}, dataSet) {
  const friends = findFriends(id, dataSet)
  friends.forEach((friend, index) => {
    if (!index) {
      friendsList.innerHTML = friend;
    } else {
      friendsList.innerHTML += `<br></br>${friend}</span>`;
    };
  });
};

function displayHydrationInfo({id}, dataSet) {
  const dailyInfo = findIntakeWeek(id, dataSet);
  makeChart(dailyInfo, 'hydration');
  dailyInfo.forEach(({date, numOunces}, index) => {
      hydrationWeek.innerHTML += `<br></br>${formatDate(date)}: ${numOunces} ounces`;
      if(submittedData && !index){
        hydrationWeek.innerHTML = ''; 
        hydrationWeek.innerHTML += `<br></br><span class="today-span">TODAY: ${numOunces} ounces`;
      }
  });
};

function displayAverages({id}, sleepDataSet, hydrationDataSet) {
  let avgSleepQuality = calculateAvgSleepData(id, sleepDataSet, 'sleepQuality');
  let avgSleepHours = calculateAvgSleepData(id, sleepDataSet, 'hoursSlept');
  let avgIntake = calculateAverageIntake(id, hydrationDataSet);
  avg.innerHTML = '';
  avg.innerHTML += `Hours Slept: ${avgSleepHours}<br></br>Sleep Quality: ${avgSleepQuality} out of 5<br></br>Water Intake: ${avgIntake} Ounces`
};

function displaySleepInfo({id}, dataSet) {
  let today = dataSet.filter((entry) => {
    return entry.userID === id;
  }).slice(-1)[0].date;
  let weeklySleepInfo = findSleepInfoWeek(id, today, dataSet);
  makeChart(weeklySleepInfo, 'sleepQuality');
  makeChart(weeklySleepInfo, 'hoursSlept');
  weeklySleepInfo.forEach(({hoursSlept, date}, index) => {
    sleepHoursWeek.innerHTML += `<br></br>${formatDate(date)}: ${hoursSlept} hours`;
    if(submittedData && !index){
     sleepHoursWeek.innerHTML = ''; 
     sleepHoursWeek.innerHTML += `<br></br><span class="today-span">TODAY: ${hoursSlept} hours</span>`;
    }
  });
  weeklySleepInfo.forEach(({sleepQuality, date}, index) => {
    sleepQualityWeek.innerHTML += `<br></br>${formatDate(date)}: ${sleepQuality} out of 5`;;
    if(submittedData && !index){
      sleepQualityWeek.innerHTML = '';
      sleepQualityWeek.innerHTML += `<br></br><span class="today-span">TODAY: ${sleepQuality} out of 5`;
    }
  });
};

function displayStepInfo({strideLength, dailyStepGoal}, dataSet) {
  let averageSteps = getAverageSteps(dataSet);
  let message;
  let differenceInSteps = Math.abs(averageSteps - dailyStepGoal);

  if(averageSteps > dailyStepGoal) {
    message = `Your step goal was ${differenceInSteps} steps less than the average.`;
  } else if (averageSteps < dailyStepGoal){
    message = `Your step goal was ${differenceInSteps} steps more than the average!`;
  } else {
    message = `Your step goal was equal to the average.`;
  }
  steps.innerHTML = `Stride Length: ${strideLength}<br></br>Daily Step Goal: ${dailyStepGoal}<br></br>${message}`;
};

function formatDate(date) {
  return date.split('').splice(5).join('');
};

function formatAddress(addressInfo) {
  let splitAddress = addressInfo.split(', ');
  let [addrLine1, addrLine2] = splitAddress;

  return `${addrLine1},</br>${addrLine2}`;
};

function toggleGraph(category) {
 let graphURL = "./images/graph-icon.png";
  let textURL = "./images/txt-icon.png";
  
  if(category === 'hydration'){
    hydrationWeek.classList.toggle('hidden');
    hydroChartContainer.classList.toggle('hidden');
    hydroTitle.classList.toggle('hidden');
    if(!displayingHydroGraph) {
      hydroButton.src = textURL;
      hydroButton.alt = "text icon" 
    } else {
      hydroButton.src = graphURL;
      hydroButton.alt = "bar graph icon"
    };
    displayingHydroGraph = !displayingHydroGraph;
  } else if (category === 'sleepQuality') {
    sleepQualityWeek.classList.toggle('hidden');
    qualityChartContainer.classList.toggle('hidden');
    qualityTitle.classList.toggle('hidden');
    if(!displayingQualityGraph) {
      qualityButton.src = textURL;
      qualityButton.alt = "text icon"
    } else {
      qualityButton.src = graphURL;
      qualityButton.alt = "bar graph icon"
    };
    displayingQualityGraph = !displayingQualityGraph;
  } else {
    sleepHoursWeek.classList.toggle('hidden');
    hoursChartContainer.classList.toggle('hidden');
    hoursTitle.classList.toggle('hidden');
    if(!displayingHoursGraph) {
      hoursButton.src = textURL;
      hoursButton.alt = "text icon"
    } else {
      hoursButton.src = graphURL;
      hoursButton.alt = "bar graph icon"
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
  friendSelectors.innerHTML = `<legend>Can Your Team Beat the Global Average?</legend></br>
  <legend>Select Friends to join:</legend>`
  friendsByData.forEach(({name, id}) => {
    if(name !== randomUser.name) {
      friendSelectors.innerHTML +=  `
      <label class="friend-label">
        <input type='radio' name='${name}' id='friend-id-${id}'>${name}
      </label>`
    }
  });
};

function displayFriendSelector() {
  partyButton.classList.add('hidden');
  friendSelectors.classList.remove('hidden');
  partyWidget.classList.remove('party-background');
  letsPartyButton.classList.remove('hidden');
}

function resetStepParty() {
  displayPartyButton();
  partyResults.classList.add('hidden');
  firework1.classList.add('hidden');
  firework2.classList.add('hidden');
  firework3.classList.add('hidden');
  partyResults.classList.remove('winner-text');
  partyWidget.classList.remove('winner-background');
  resetRadioButtons();
  letsPartyButton.innerText = "LET'S PARTY!"
}

function resetRadioButtons() {
  let bubbles = friendSelectors.querySelectorAll('input');
  bubbles.forEach(radioButton => {
    radioButton.checked = false;
  });
}

function displayPartyButton() {
  partyButton.classList.remove('hidden');
  friendSelectors.classList.add('hidden');
  partyWidget.classList.add('party-background');
  letsPartyButton.classList.add('hidden');
  letsPartyButton.innerText === "LET'S PARTY!"
}

function togglePartyMode() {
  letsPartyButton.innerText = 'Back Home';
  friendSelectors.classList.add('hidden');
}

function computePartyMode() {
  let bubbles = friendSelectors.querySelectorAll('input');
  let selectedFriendsFullIds = [];
  bubbles.forEach(({checked, id}) => {
    if(checked) {
      selectedFriendsFullIds.push(id);
    }
  });

  let selectedFriendsIds = selectedFriendsFullIds.map((friend) => {
    return parseInt(friend.split('-')[2]);
  })

  let finalSelectedFriendObjects = friendsByData.filter(({id}) => {
    return selectedFriendsIds.includes(id);
  })

  finalSelectedFriendObjects.push(randomUser);
  
  let friendsStepGoalAverage = finalSelectedFriendObjects.reduce((total, {dailyStepGoal}) => {
    total += dailyStepGoal
    
    return total 
  }, 0) / finalSelectedFriendObjects.length

  return friendsStepGoalAverage 
}

function generatePartyMode() {
  computePartyMode();
  togglePartyMode()
}

function makeChart(dataSet, dataCategory) {
  let ctx;
  if (dataCategory === 'hydration'){
    if(renderedHydroChart) {
      renderedHydroChart.destroy();
    }
    ctx = hydroChart.getContext('2d');
    ctx.canvas.height = hydroChartContainer.style.height;
    renderedHydroChart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          backgroundColor: 'yellow',
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
            grid: {
              display: true,
              color: 'rgba(128, 128, 128, 0.376)',
            },
            title: {
                display: true,
                color: '#FF40AF'
            },
            border: {
              color: '#FF40AF',
              width: 1
            }
          },
          x: {
            ticks: {
              padding: -3,
              color: 'yellow',
              maxRotation: 45,
              minRotation: 45
            },
            grid: {
              display: true,
              color: 'rgba(128, 128, 128, 0.376)',
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
    renderedHydroChart.data.labels = dataSet.map(({date}) => { return date.slice(5) });
    renderedHydroChart.data.datasets[0].data = dataSet.map(({numOunces}) => { return numOunces });
    renderedHydroChart.options.scales.y.min = 0;
    renderedHydroChart.options.scales.y.max = 100;
    renderedHydroChart.options.scales.y.title.text = 'number of ounces';
    renderedHydroChart.update();
  } else if (dataCategory === 'sleepQuality') {
      if(renderedQualityChart) {
        renderedQualityChart.destroy();
      }
      ctx = qualityChart.getContext('2d');
      ctx.canvas.height = qualityChartContainer.style.height;
      renderedQualityChart = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [{
            backgroundColor: 'yellow',
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
              grid: {
                display: true,
                color: 'rgba(128, 128, 128, 0.376)',
              },
              title: {
                  display: true,
                  color: '#FF40AF'
              },
              border: {
                color: '#FF40AF',
                width: 1
              }
            },
            x: {
              ticks: {
                padding: -3,
                color: 'yellow',
                maxRotation: 45,
                minRotation: 45
              },
              grid: {
                display: true,
                color: 'rgba(128, 128, 128, 0.376)',
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
      renderedQualityChart.data.labels = dataSet.map(({date}) => { return date.slice(5) });
      renderedQualityChart.data.datasets[0].data = dataSet.map(({sleepQuality}) => { return sleepQuality });
      renderedQualityChart.options.scales.y.min = 0;
      renderedQualityChart.options.scales.y.max = 5;
      renderedQualityChart.options.scales.y.title.text = 'sleep quality';
      renderedQualityChart.update();
  } else {
      if(renderedHoursChart) {
        renderedHoursChart.destroy();
      }
      ctx = hoursChart.getContext('2d');
      ctx.canvas.height = hoursChartContainer.style.height;
      renderedHoursChart = new Chart(ctx, {
          type: 'line',
          data: {
          datasets: [{
              backgroundColor: 'yellow',
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
                      grid: {
                          display: true,
                          color: 'rgba(128, 128, 128, 0.376)',
                      },
                      title: {
                          display: true,
                          color: '#FF40AF'
                      },
                      border: {
                          color: '#FF40AF',
                          width: 1
                      }
                  },
                  x: {
                      ticks: {
                          padding: -3,
                          color: 'yellow',
                          maxRotation: 45,
                          minRotation: 45
                      },
                      grid: {
                          display: true,
                          color: 'rgba(128, 128, 128, 0.376)',
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
          }
      })
      renderedHoursChart.data.labels = dataSet.map(({date}) => { return date.slice(5) });
      renderedHoursChart.data.datasets[0].data = dataSet.map(({hoursSlept}) => { return hoursSlept });
      renderedHoursChart.options.scales.y.min = 0;
      renderedHoursChart.options.scales.y.max = 12;
      renderedHoursChart.options.scales.y.title.text = 'hours slept';
      renderedHoursChart.update();
  }
}

function changeDisplay() {
  main.classList.toggle('hidden');
  userProfile.classList.toggle('hidden');
  todayForm.classList.toggle('hidden');
  if (main.classList.contains('hidden')) {
    profileButton.src="./images/home-icon.png"
    profileButton.alt = "Outline of a house"
  } else if (userProfile.classList.contains('hidden')) {
    profileButton.src="./images/profile-icon.png"
    profileButton.alt = "Simple profile of a person"
  }
}

function announceStepPartyResult() {
  partyResults.classList.remove('hidden')
  let score = computePartyMode()
  if (score > 6780) {
    partyResults.innerHTML = `<h2>GO TEAM! You guys collectively beat the global average by <span style="color:pink">${parseInt(score - 6780)}</span> steps! 🤩</h2>`
    firework1.classList.remove('hidden');
    firework2.classList.remove('hidden');
    firework3.classList.remove('hidden');
    partyResults.children[0].classList.add('winner-text');
    partyWidget.classList.add('winner-background');
  } else {
    partyResults.innerHTML = `<h2>Better luck next time...you collectively missed the global average by <span style="color:pink">${parseInt(6780 - score)}</span> steps 😔</h2>`
  }
}