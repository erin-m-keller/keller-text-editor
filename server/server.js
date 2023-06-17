// import required modules
const express = require('express'),
      app = express(),
      PORT = process.env.PORT || 3000; 
      
// serve static files from the '../client/dist' directory
app.use(express.static('../client/dist')); 
// parse URL-encoded bodies
app.use(express.urlencoded({ extended: true })); 
// parse JSON bodies
app.use(express.json()); 
// include the HTML routes by requiring and passing the app instance
require('./routes/htmlRoutes')(app); 
// start the server and listen on the specified port, and log a message to the console when the server is running
app.listen(PORT, () => console.log(`Now listening on port: ${PORT}`)); 
