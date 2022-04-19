const express = require('express'); // Import express
const app = express();  // Create an instance of express


const morgan = require("morgan")  // Import morgan
const chalk = require('chalk'); // Import chalk


const cors = require("cors")  // Import cors

const mongoose = require('mongoose'); // Import mongoose

require("dotenv").config()  // Import dotenv


const userRoutes = require('./routes/userRoutes.js'); // Import userRoutes
const authRoutes = require('./routes/authRoutes.js'); // Import authRoutes
const edtRoutes = require('./routes/edtRoutes.js'); // Import edtRoutes

mongoose.set('debug', true);  // Set mongoose debug to true

mongoose.connect( // Connect to mongoDB
  process.env.MONGO_URL,  // Use the MONGO_URL environment variable
  { 
     useNewUrlParser: true, // Use the new url parser
     useUnifiedTopology: true // Use the new topology
  }).then(test => console.log(chalk.blue(test ? "[MongoDB] Connexion MongoDB établit" : "Connexion MongoDB impossible"))); // Log the result

app.use(morgan('dev')); // Use morgan to log requests

app.use(express.urlencoded({extended: false})); // Use express.urlencoded to parse the body of the request

app.use(express.json()); // Use express.json to parse the body of the request

app.use(cors({  // Use cors to allow cross-origin requests 
  origin: '*',  
  methods: 'PUT, POST, DELETE, GET, PATCH'
}));

app.use('/api/users', userRoutes);  // Use userRoutes
app.use('/api/auth', authRoutes); // Use authRoutes
app.use('/api/edt', edtRoutes); // Use edtRoutes


app.use((req, res, next) => { // Use a middleware to handle errors 
  const error = new Error('Not found'); // Create an error
  error.status = 404; // Set the status
  next(error);  // Call next with the error
});

app.use((error, req, res, next) => {  // Use a middleware to handle errors 
  res.status(error.status || 500);  // Set the status
  res.json({  // Send the error
      error: { 
          message: error.message
      }
  });
});

module.exports = app; // Export app
