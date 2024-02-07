// Your fetch requests will live here!


// console.log('I will be a fetch request!')

// fetch('https://fitlit-api.herokuapp.com/api/v1/users')
//     .then(response => response.json())
//     // .then(data => data)
//     // .then(userArray => console.log(userArray))
//     // .then(data => console.log('response data: ', data))
//     .then(data => {
//         data.users.forEach((user) => {
//             users.push(user)
//         })
//     });

// export const users = []
// console.log('user data: ', users)

function getUsers() {
    return fetch('https://fitlit-api.herokuapp.com/api/v1/users')
}

function getHydration() {
    return fetch('https://fitlit-api.herokuapp.com/api/v1/hydration')
}



// const data = Promise.all([getUsers(), getHydration()])
//     .then(values => Promise.all(values.map( value => value.json())))
//     .then(parsed => parsed)

function getData() {
    return Promise.all([getUsers(), getHydration()])
    .then(values => Promise.all(values.map( value => value.json())))
    .then(data => {
        let formattedData = {};
        data.forEach((element) => {
            // console.log('element', Object.keys(element))
            formattedData[Object.keys(element)] = element
        })
        return formattedData
    })
    // .then(parsed => parsed)
}

// const data = getData()
// console.log('data', data)

export {
    getData
}

