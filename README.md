# Issue Tracker

This is the boilerplate for the Issue Tracker project. Instructions for building your project can be found at https://www.freecodecamp.org/learn/quality-assurance/quality-assurance-projects/issue-tracker

### if you use replit for this or other similar projects add at the bottom of the 2_functional-tests.js file:
```
//Reloads the page after it crashes when finishing the tests
  //This is necessary because Replit is bugged
  after(function() {
    chai.request(server)
      .get('/')
  })
```
