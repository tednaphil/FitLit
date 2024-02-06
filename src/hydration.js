
function calculateAverageIntake(user, hydrationData) {
    const userID = user.id
    const hydrationEntries = hydrationData.filter(day => day.userID === userID)
    const totalIntake = hydrationEntries.reduce((sum, entry) => {
       return sum += entry.numOunces}, 0)  
    const averageIntake = Math.round(totalIntake / hydrationEntries.length)
    
    return averageIntake;
}




export { calculateAverageIntake }