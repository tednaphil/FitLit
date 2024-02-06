function getUserInfo(id, people){
    const userInfo = people.find(user => {
        return user.id === id; 
    })

    return userInfo; 
}

function getAverageSteps(people){
    const averageSteps = people.reduce((total, user) => {
    total += user.dailyStepGoal

    return total; 
    }, 0)

    return averageSteps/people.length;
}

export { getUserInfo, getAverageSteps }  