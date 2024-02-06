function getUserInfo(id, people){
    const userInfo = people.find(user => {
        return user.id === id; 
    })

    return userInfo; 
}

export { getUserInfo }  