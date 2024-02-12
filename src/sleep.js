function calculateAvgHoursSlept(id, sleepData) {
    const userInfo = sleepData.filter(data => data.userID === id);
    const avgHours = ((userInfo.reduce((total, data) => {
        total += data.hoursSlept;
        return total;
    }, 0)) / userInfo.length).toFixed(2);

    return avgHours;
};

function calculateAvgSleepQuality(id, sleepData) {
    const userInfo = sleepData.filter(data => data.userID === id);
    const avgQuality = ((userInfo.reduce((total, data) => {
        total += data.sleepQuality;
        return total;
    }, 0)) / userInfo.length).toFixed(2);

    return avgQuality;
};

function findSleepHourDay(id, date, sleepData) {
    const userInfo = sleepData.filter(data => data.userID === id);
    const day = userInfo.find(data => data.date === date); 
    
    return day ? day.hoursSlept : `There is no entry for the date provided.`;   
};

function findSleepQualityDay(id, date, sleepData) {
    const userInfo = sleepData.filter(data => data.userID === id);
    const day = userInfo.find(data => data.date === date);
    
    return day ? day.sleepQuality : `There is no entry for the date provided.`;   
};

function findHoursSleptWeek(id, date, sleepData) {
    const userInfo = (sleepData.filter(data => data.userID === id)).reverse();
    const index = userInfo.findIndex(data => data.date === date);
    const array = userInfo.splice(index, (index + 7));
    const hours = array.map((date) => { 
        return date = {
            userID: id,
            date: date['date'],
            hoursSlept: date['hoursSlept']
        };
    });
    
    return hours;
};

function findSleepQualityWeek(id, date, sleepData) {
    const userInfo = (sleepData.filter(data => data.userID === id)).reverse();
    const index = userInfo.findIndex(data => data.date === date);
    const array = userInfo.splice(index, (index + 7));
    const quality = array.map((date) => { 
        return date = {
            userID: id,
            date: date['date'],
            sleepQuality: date['sleepQuality']
        };
    });
    
    return quality;
};

export {
    calculateAvgHoursSlept,
    calculateAvgSleepQuality,
    findSleepHourDay,
    findSleepQualityDay,
    findHoursSleptWeek,
    findSleepQualityWeek
 };