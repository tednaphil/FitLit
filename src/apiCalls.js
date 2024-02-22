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
        date: "2023/07/01",
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
        date: "2023/07/01",
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
    .then((res) => {
      return Promise.all(res.map((item) => {
      return item.json();
      }))
    })
    .catch(error => {
      setTimeout(() => {
        alert(error)
        }, 1050)
      return error; 
    });   
  };

  export { fetchData, runPost};