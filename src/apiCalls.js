function runGet(){
  const allData = [
    fetch(`http://localhost:3001/api/v1/users`),
    fetch(`http://localhost:3001/api/v1/sleep`),
    fetch(`http://localhost:3001/api/v1/hydration`)
  ];
  return allData; 
}

function runPost(id, dateField, hydroField, hoursField, qualityField){
  const postData = [
    fetch(`http://localhost:3001/api/v1/hydration`, {
      method: "POST",
      body: JSON.stringify({
        userID: id,
        date: dateField.value,
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
        date: dateField.value,
        hoursSlept: Number(hoursField.value),
        sleepQuality: Number(qualityField.value),
      }),
      headers: {
        "Content-type": "application/json"
        }
      }),
    ];
    return postData; 
  }

  function fetchData() {
   return Promise.all(runGet())
      .then((res) => {
       return Promise.all(res.map((item) => {
        return item.json();
        }))
      })
      .catch(error => {
        console.log("error")
        return error; 
      })    
  };



  export { fetchData, runPost, runGet};