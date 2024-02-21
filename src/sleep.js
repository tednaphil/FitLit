function calculateAvgHoursSlept(id, sleepData) {
    const userInfo = sleepData.filter(data => data.userID === id);
    const avgHours = (userInfo.reduce((total, data) => {
        return total += data.hoursSlept;
    }, 0)) 
    const avgHoursSlept = (avgHours/userInfo.length).toFixed(2);

    return avgHours ? avgHoursSlept : `You do not have any data yet.`;
};

function calculateAvgSleepQuality(id, sleepData) {
    const userInfo = sleepData.filter(data => data.userID === id);
    const avgQuality = (userInfo.reduce((total, data) => {
        return total += data.sleepQuality;
    }, 0))
    const avgSleepQuality = (avgQuality/userInfo.length).toFixed(2);
    return avgQuality ? avgSleepQuality : `You do not have any data yet.`;
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