# <p align="center">FitLit</p>

<p align="center">This is a dashboard designed to display a user's activity data including hours of sleep, fluid intake, and step goal compared to the community's average. Users can also input sleep and fluid intake information for the day, as well as initiate a step challenge with some or all of your friends!</p>

### <p align="center">Contributors</p>
<div align="center">

[Adam Bedient](https://github.com/cOdeBedient) - [Erin Kelley](https://github.com/kelleyej) - [Pareesa Kamgar-Dayhoff](https://github.com/pareesakd1118) - [Tayla Phillips](https://github.com/tednaphil)

</div>

## Preview:
<div align="center">
  <img src="https://github.com/tednaphil/FitLit/assets/76406423/5a5b4e58-e46e-40c2-87b0-20176992f9a9" alt="app demo">



</div>

<p align="center">Technologies Used</p>
<div align="center">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000&style=for-the-badge" alt="javascript badge">
  <img src="https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=fff&style=for-the-badge" alt="html badge">
  <img src="https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=fff&style=for-the-badge" alt="css badge">
  <img src="https://img.shields.io/badge/Mocha-8D6748?logo=mocha&logoColor=fff&style=for-the-badge" alt="mocha badge">
  <img src="https://img.shields.io/badge/Chai-A30701?logo=chai&logoColor=fff&style=for-the-badge" alt="chai badge">
  <img src="https://img.shields.io/badge/Visual%20Studio%20Code-007ACC?logo=visualstudiocode&logoColor=fff&style=for-the-badge" alt="vscode badge">
  <img src="https://img.shields.io/badge/Lighthouse-F44B21?logo=lighthouse&logoColor=fff&style=for-the-badge" alt="lighthouse badge">
  <img src="https://img.shields.io/badge/Chart.js-FF6384?logo=chartdotjs&logoColor=fff&style=for-the-badge" alt="chart.js badge">
</div>

## Installation Instructions:
- clone the local server to your machine
    
    ```
    git clone git@github.com:turingschool-examples/fitlit-api.git
    ```
    
- run `cd fitlit-api`
- run `npm install`
- run `npm start` to run the local server
- navigate to this [link](https://tednaphil.github.io/FitLit/)
- use `CTRL + C` to stop running the local server when finished browsing the dashboard

## Context:
### Version 1.0
<!-- wins, challenges, time spent, etc -->
- Ongoing group project begun in the 8th week of contributors learning JavaScript
- Approximately 20 hours to complete test suite and functionality
- Goals:
  ```
  - Perform data manipulation with prototype methods
  - Create navigable and easy to follow user interface
  - Use SRP code that strives for purity
  - Implement robust testing suite using TDD
  - Retrieve data with network requests
  ```
- Wins:
  ```
  - TDD approach taken to writing robust tests, driving code-writing that meets user-story-guided benchmarks
  - Making network requests to multiple datasets, processing data with promise chaining and Promise.all()
  - Working with webpack to execute cross-file imports/exports
  - Integration of graphs on DOM
  - Use of GitHub project board to organize tasks and communicate asynchronously amongst team members
  - Utilizing PR templates to streamline group workflow
  - Quickly and collaboratively establishing a comfortable, safe, and productive team atmosphere with new teammates

  ```
- Challenges:
  ```
  - Working across four time-zones, and collaborators each having rigorous classroom schedules
  - Working with webpack for the first time, understanding its import/export workflow
  - API fetch calls, asynchronous function calls, and using Promise.all()

  ```

### Version 2.0
<!-- wins, challenges, time spent, etc -->
- Second portion of group project begun in the 10th week of contributors learning JavaScript
- Approximately 20 hours to complete added functionality and layout restructuring. 
- Goals:
  ```
  - Utilize POST API to allow users to input and store data
  - Implement tools to improve accessibility throughout the app
  - Incorporate feedback from user testing
  - Implement error handling to improve user experience 
  ```
- Wins:
  ```
  - Achieving score of 100 on lighthouse for accessibility
  - Successfully posting user data to the dashboard
  - Use of chart.js to dynamically plot user data

  ```
- Challenges:
  ```
  - Working with POST API fetch calls
  - Redesigning Version 1.0 user dashboard to include new features
  ```

## Future Improvements:
  ```
  - More testing for DOM-related functions
  - Include more animations, text-effects, etc. to enhance UX
  - Refactor some DOM functions to DRY up code, possibly deferring some functionality to other files
  - Incorporate Sass to clean up CSS
  - Move chart functions to separate file to better organize repository 
  ```
