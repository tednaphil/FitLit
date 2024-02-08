function calculateAvgHoursSlept(id, sleepData) {
    const userInfo = sleepData.filter(data => data.userID === id)
    const avgHours = (userInfo.reduce((total, data) => {
        total += data.hoursSlept;
        return total;
    }, 0))/userInfo.length;

    return avgHours;
}

function calculateAvgSleepQuality(id, sleepData) {
    const userInfo = sleepData.filter(data => data.userID === id)
    const avgQuality = ((userInfo.reduce((total, data) => {
        total += data.sleepQuality;
        return total;
    }, 0))/userInfo.length).toFixed(2);

    return avgQuality;
}


export {
    calculateAvgHoursSlept,
    calculateAvgSleepQuality,
 }