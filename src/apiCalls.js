function runGet(){
  const allData = [
    fetch(`http://localhost:3001/api/v1/users`),
    fetch(`http://localhost:3001/api/v1/sleep`),
    fetch(`http://localhost:3001/api/v1/hydration`)
  ];

  return allData; 
}

function runPost(id, hydroField, hoursField, qualityField) {
  const postData = [
    fetch(`http://localhost:3001/api/v1/hydration`, {
      method: "POST",
      body: JSON.stringify({
        userID: id,
        date: "2023/07/02",
        numOunces: Number(hydroField.value)
      }),
      headers: {
        "Content-type": "application/json"
      }
    }),
    fetch(`http://localhost:3001/api/v1/sleep`, {
      method: "POST",
      body: JSON.stringify({
        userID: id,
        date: "2023/07/02",
        hoursSlept: Number(hoursField.value),
        sleepQuality: Number(qualityField.value),
      }),
      headers: {
        "Content-type": "application/json"
        }
      }),
    ];

    return postData; 
  };

  function fetchData() {
   return Promise.all(runGet())
   .then(responses => {
    if (responses.every(response => response.ok)) {
      return responses
    } else {
      let responseText = responses.find(response => !response.ok).statusText
      let responseCode = responses.find(response => !response.ok).status
      throw new Error(`${responseCode} - ${responseText} :(`)
    }
   })
    .then((res) => {
      return Promise.all(res.map((item) => {
      return item.json();
      }))
    })
    .catch(error => {
      let errorText = error.message
      console.log('Fetch Error')
      throw new Error(`${errorText}`)
    })  
  };

  export { fetchData, runPost};
