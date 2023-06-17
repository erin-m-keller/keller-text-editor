// initialize variables
const path = require('path'); 

// define a function named 'serveHomePage' and export it
module.exports = function serveHomePage(app) { 
  // handle GET requests to the root URL ('/')
  app.get('/', function(req, res) { 
    // construct the file path to the 'index.html' file
    const filePath = path.join(__dirname, '../../dist/index.html'); 
    // send the 'index.html' file as the response
    res.sendFile(filePath); 
  });
};