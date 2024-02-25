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
const todayInfo = document.querySelector('h3');
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
const hydroField = document.querySelector('#hydro-field');
const hoursField = document.querySelector('#hours-field');
const qualityField = document.querySelector('#quality-field');
const friendsWidget = document.querySelector('.friends-widget');
const friendSelectors = document.querySelector('#friend-selectors');
const partyButton = document.querySelector('.step-party-button');
const letsPartyButton = document.querySelector('#lets-party');
const partyChartContainer = document.querySelector('#party-chart-container');
const partyChart = document.querySelector('#party-chart');
const footer = document.querySelector('footer');
const hydroChart = document.querySelector('#hydro-chart');
const hydroChartContainer = document.querySelector('#hydro-chart-container');
const qualityChart = document.querySelector('#quality-chart');
const qualityChartContainer = document.querySelector('#quality-chart-container');
const hoursChart = document.querySelector('#hours-chart');
const hoursChartContainer = document.querySelector('#hours-chart-container');

//EVENT LISTENERS
window.addEventListener('load', renderDom);
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
letsPartyButton.addEventListener('click', generatePartyMode);

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

// GLOBAL VARIABLES
let displayingHydroGraph = false;
let displayingHoursGraph = false;
let displayingQualityGraph = false;
let friendsByData = [];
let renderedHydroChart;
let renderedHoursChart;
let renderedQualityChart;
let renderedPartyChart;
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
      displayTodayInfo(randomUser, sleep.sleepData, hydration.hydrationData);
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
  footer.classList.add("fade-out")
  setTimeout(() => {
    footer.classList.add("fade-in")
    footer.innerText = "You did it! Congrats on entering your hydration and sleep information for today.";
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
  footer.classList.add('hidden');
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

function displayTodayInfo({id}, sleepDataSet, hydrationDataSet) {
  const today = sleepDataSet.filter((entry) => {
    return entry.userID === id;
  }).slice(-1)[0].date;
  const ouncesDrank = findIntakeByDay(id, today, hydrationDataSet);
  const todayHoursSlept = findSleepDayInfo(id, today, sleepDataSet, "hoursSlept");
  const sleepQualityDay = findSleepDayInfo(id, today, sleepDataSet, "sleepQuality");

  todayInfo.innerText = `Today you drank ${ouncesDrank} ounces of water and slept ${todayHoursSlept} hours with a sleep quality of ${sleepQualityDay} out of 5!`;
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
    } else {
      hydroButton.src = graphURL;
    };
    displayingHydroGraph = !displayingHydroGraph;
  } else if (category === 'sleepQuality') {
    sleepQualityWeek.classList.toggle('hidden');
    qualityChartContainer.classList.toggle('hidden');
    qualityTitle.classList.toggle('hidden');
    if(!displayingQualityGraph) {
      qualityButton.src = textURL;
    } else {
      qualityButton.src = graphURL;
    };
    displayingQualityGraph = !displayingQualityGraph;
  } else {
    sleepHoursWeek.classList.toggle('hidden');
    hoursChartContainer.classList.toggle('hidden');
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
  
//   const newChart = new Chart(ctx, {
//     type: 'line',
//     data: {
//       datasets: [{
//         backgroundColor: 'yellow',
//         barThickness: 10,
//         pointRadius: 0,
//         pointBorderColor: 'yellow',
//         borderColor: [
//           'yellow',
//         ],
//         borderWidth: 2,
//       }]
//     },
//     options: {
//       plugins: {
//         legend: {
//             display: false,
//         }
//       },
//       scales: {
//         y: {
//           ticks: {
//             padding: 5,
//             color: 'yellow',
//           },
//           grid: {
//             display: true,
//             color: 'rgba(128, 128, 128, 0.376)',
//             // opacity: .1
//           },
//           title: {
//               display: true,
//               color: '#FF40AF'
//           },
//           border: {
//             color: '#FF40AF',
//             width: 1
//           }
//         },
//         x: {
//           ticks: {
//             padding: -3,
//             color: 'yellow',
//             maxRotation: 45,
//             minRotation: 45
//           },
//           grid: {
//             display: true,
//             color: 'rgba(128, 128, 128, 0.376)',
//             // opacity: .1
//           },
//           title: {
//             display: true,
//             text: 'day',
//             color: '#FF40AF'
//         },
//           border: {
//             color: '#FF40AF',
//             width: 1
//           }
//         }
//       }
//     },
//   })
//   newChart.data.labels = dataSet.map((day) => { return day.date.slice(5) });
//   if (dataCategory === 'hydration'){
//     newChart.data.datasets[0].data = dataSet.map((day) => { return day.numOunces });
//     newChart.options.scales.y.min = 0;
//     newChart.options.scales.y.max = 100;
//     newChart.options.scales.y.title.text = 'number of ounces';
//   } else if (dataCategory === 'sleepQuality') {
//     newChart.data.datasets[0].data = dataSet.map((day) => { return day.sleepQuality });
//     newChart.options.scales.y.min = 0;
//     newChart.options.scales.y.max = 5;
//     newChart.options.scales.y.title.text = 'sleep quality';
//   } else {
//     newChart.data.datasets[0].data = dataSet.map((day) => { return day.hoursSlept });
//     newChart.options.scales.y.min = 0;
//     newChart.options.scales.y.max = 12;
//     newChart.options.scales.y.title.text = 'hours slept';
//   }
// }

function togglePartyMode() {
  letsPartyButton.innerText = 'Back Home';
  friendSelectors.classList.add('hidden');
  partyChartContainer.classList.remove('hidden');
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
}

function generatePartyMode() {
  computePartyMode();
  togglePartyMode()
  renderPartyChart();
}

function makeChart(dataSet, dataCategory) {
  let ctx;
  if (dataCategory === 'hydration'){
    if(renderedHydroChart) {
      console.log('made it here on click')
      console.log("renderedHydroChart before destroy:", renderedHydroChart)
      renderedHydroChart.destroy();
      console.log("renderedHydroChart after destroy:", renderedHydroChart)
    }
    ctx = hydroChart.getContext('2d');
    ctx.canvas.height = hydroChartContainer.style.height;
    console.log("renderedHydroChart on load:", renderedHydroChart)
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
              // opacity: .1
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
              // opacity: .1
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
    console.log("renderedHydroChart on after initial build", renderedHydroChart)
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
                // opacity: .1
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
                // opacity: .1
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
                          // opacity: .1
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
                          // opacity: .1
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

function renderPartyChart() {
  if(renderedPartyChart) {
    renderedPartyChart.destroy();
  }
  let ctx;
  ctx = partyChart.getContext('2d');
  ctx.canvas.height = partyChartContainer.style.height;
  renderedPartyChart = new Chart(ctx, {
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
  // renderedPartyChart.data.labels = dataSet.map((day) => { return day.date.slice(5) });
  // renderedPartyChart.data.datasets[0].data = dataSet.map((day) => { return day.numOunces });
  // renderedPartyChart.options.scales.y.min = 0;
  // renderedPartyChart.options.scales.y.max = 100;
  // renderedPartyChart.update();
}

function changeDisplay() {
  main.classList.toggle('hidden');
  userProfile.classList.toggle('hidden');
  footer.classList.toggle('hidden');
  if (main.classList.contains('hidden')) {
    profileButton.src="./images/home-icon.png"
  } else if (userProfile.classList.contains('hidden')) {
    profileButton.src="./images/profile-icon.png"
  }
}