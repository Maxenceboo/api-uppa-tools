const express = require('express');
const app = express();


const morgan = require("morgan")
const chalk = require('chalk');


const cors = require("cors")

const mongoose = require('mongoose');

require("dotenv").config()


const userRoutes = require('./routes/userRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const edtRoutes = require('./routes/edtRoutes.js');

mongoose.set('debug', true);

mongoose.connect(
  process.env.MONGO_URL,
  {
     useNewUrlParser: true,
     useUnifiedTopology: true
  }).then(test => console.log(chalk.blue(test ? "[MongoDB] Connexion MongoDB établit" : "Connexion MongoDB impossible"))); 

app.use(morgan('dev'));

app.use(express.urlencoded({extended: false}));

app.use(express.json());

app.use(cors({
  origin: '*',
  methods: 'PUT, POST, DELETE, GET, PATCH'
}));

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/edt', edtRoutes);


app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
      error: {
          message: error.message
      }
  });
});

module.exports = app;
