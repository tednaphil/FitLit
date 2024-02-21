function calculateAvgSleepData(id, sleepData, dataCategory) {
    const userInfo = sleepData.filter(data => data.userID === id);
    const total = (userInfo.reduce((total, data) => {
        return total += data[dataCategory]
    }, 0))
    const avgSleepData = (total/userInfo.length).toFixed(2);
    return total ? avgSleepData : `You do not have any data yet.`;
}

function findSleepDayInfo(id, date, sleepData, dataCategory) {
    const userInfo = sleepData.filter(data => data.userID === id);
    const day = userInfo.find(data => data.date === date);
    
    return day ? day[dataCategory] : `There is no entry for the date provided.`;   
};

function findSleepInfoWeek(id, date, sleepData) {
    const userInfo = (sleepData.filter(data => data.userID === id)).reverse();
    const index = userInfo.findIndex(data => data.date === date);
    const array = userInfo.splice(index, (index + 7));
    const weekInfo = array.map((date) => { 
        return date = {
            userID: id,
            date: date['date'],
            hoursSlept: date['hoursSlept'],
            sleepQuality: date['sleepQuality']
        };
    });

    return index >= 0 ? weekInfo : `There are no entries for the week provided.`
};

export {
    calculateAvgSleepData,
    findSleepDayInfo,
    findSleepInfoWeek
 };