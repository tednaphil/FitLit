//NOTE: Your DOM manipulation will occur in this file

//Here are 2 example functions just to demonstrate one way you can export/import between the two js files. You'll want to delete these once you get your own code going.
const exampleFunction1 = (person) => {
  return `oh hi there ${person}`
  console.log(`oh hi there ${person}`)
}

const exampleFunction2 = (person) => {
  return `by now ${person}`
  console.log(`bye now ${person}`)
}


export {
  exampleFunction1,
  exampleFunction2,
}