function calculateAverageIntake(id, dataSet) {
    const hydrationEntries = dataSet.filter(day => day.userID === id);
    const totalIntake = hydrationEntries.reduce((sum, entry) => {
       return sum += entry.numOunces}, 0);
    const averageIntake = Math.round(totalIntake / hydrationEntries.length);
    
    return averageIntake;
}

function findIntakeByDay(id, date, dataSet) {
    const dayEntry = dataSet.find((entry) => {
        return entry.userID === id && entry.date === date;
    });
    const intake = dayEntry.numOunces;

    return intake;
}

function findIntakeWeek(id, dataSet) {
    const userData = dataSet.filter(entry => {
        return entry.userID === id;
    }).slice(-7).reverse();
 
    return userData;
}

export { 
    calculateAverageIntake,
    findIntakeByDay,
    findIntakeWeek
}