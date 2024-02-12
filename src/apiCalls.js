const allData = [
    fetch(`https://fitlit-api.herokuapp.com/api/v1/users`),
    fetch(`https://fitlit-api.herokuapp.com/api/v1/sleep`),
    fetch(`https://fitlit-api.herokuapp.com/api/v1/hydration`)
  ];

  function fetchData() {
   return Promise.all(allData)
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

  export { fetchData };