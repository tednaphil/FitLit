// Your fetch requests will live here!


// console.log('I will be a fetch request!')

fetch('https://fitlit-api.herokuapp.com/api/v1/users')
    .then(response => response.json())
    .then(data => {
        data.users.forEach((user) => {
            userData.push(user)
        })
    });

let userData = []
// console.log('user data: ', userData)