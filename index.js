const app = require('./app'); // Import app.js

const port = 3003;  // port to listen


app.listen(port, () => {    // Start the server
    console.log('Listening to:', port); // Log the port
});
