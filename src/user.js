function getUserInfo(id, people){
    const userInfo = people.find(user => {
        return user.id === id; 
    })

    return userInfo; 
};

function getAverageSteps(people){
    const averageSteps = people.reduce((total, user) => {
    total += user.dailyStepGoal

    return total; 
    }, 0)

    return averageSteps/people.length;
};

function findFriends(id, people) {
    const user = people.find((person) => person.id === id);
    let friendNames = user.friends.map((friendId) => {
        return people.find(user => friendId === user.id).name;
    })

    return friendNames;
};

export { getUserInfo, getAverageSteps, findFriends };  