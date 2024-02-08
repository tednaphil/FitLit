function calculateAvgHoursSlept(id, sleepData) {
    const userInfo = sleepData.filter(data => data.userID === id)
    const avgHours = (userInfo.reduce((total, data) => {
        total += data.hoursSlept;
        return total;
    }, 0))/userInfo.length;

    return avgHours
}



export {
    calculateAvgHoursSlept,
    calculateAvgSleepQuality,
 }