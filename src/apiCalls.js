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

function getSleep() {
    return fetch('https://fitlit-api.herokuapp.com/api/v1/sleep')
}



// const data = Promise.all([getUsers(), getHydration()])
//     .then(values => Promise.all(values.map( value => value.json())))
//     .then(parsed => parsed)

function getData() {
    return Promise.all([getUsers(), getHydration(), getSleep()])
    .then(values => Promise.all(values.map( value => value.json())))
    .then(data => {
        let formattedData = {};
        data.forEach((element) => {
            // console.log('element', Object.keys(element))
            const key = Object.keys(element)
            formattedData[key] = element[key]
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

