const allData = [
    fetch(`http://localhost:3001/api/v1/users`),
    fetch(`http://localhost:3001/api/v1/sleep`),
    fetch(`http://localhost:3001/api/v1/hydration`)
  ];

  function fetchData() {
   return Promise.all(allData)
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
      })    
  };

  export {
    fetchData
  }