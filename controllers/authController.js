const mongoose = require('mongoose');   // Import mongoose

const User = require('../models/user'); // Import user model

const bcrypt = require("bcryptjs"); // Import bcrypt


const jwt = require("jsonwebtoken");    // Import jsonwebtoken
// regex for email 
const regexp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/ 

module.exports = {  // Export userController 
    
    signup: async (req, res, next) =>{  // Signup a user 
        const {email, password} = req.body  // Get the body of the request  (email, password) 
        await User.find({email})    // Find the user 
        .exec() // Execute the find
        .then(user => { // If the find is done
            if (user.length >= 1 ){ // If the user exist
                return res.status(409).json({   // Send the response
                    message: "Email already exists"
                });
            }else if(!regexp.test(email)){  // If the email is not valid  (regexp)
                return res.status(400).json({
                    message: "ntm rentre un email"
                });
            } else {    // If the user doesn't exist
                bcrypt.hash(req.body.password, 11, (err, hash) =>{  // Hash the password 
                    if (err){   // If the hash is not done
                        return res.status(401).json({
                            error: err
                        });
                    } else {    // If the hash is done 
                        id = new mongoose.Types.ObjectId() // Create a new id 
                        const user = new User({ // Create a new user 
                            _id : id,
                            email : req.body.email,
                            password: hash,
                            username: "",
                            name: "",
                            firstname: "",
                            ressource: 0,
                        });
                        user.save() // Save the user 
                            .then(result =>{    // If the user is saved
                                res.status(201).json({  // Send the response
                                    message: "User created"
                                });
                            })
                            .catch(err => { // If the user is not saved 
                                res.status(401).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        });
    },
    
    signin: async (req, res, next) => { // Signin a user 
        User.find({email: req.body.email})  // Find the user 
        .exec() // Execute the find 
        .then(user => { // If the find is done
            if (user.length < 1 ) { // If the user doesn't exist
                return res.status(401).json({   // Send the response
                    message: "No existing user with that email."
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, resultat)=>{  // Compare the password 
              if(!resultat) {   // If the password is not correct
                return res.status(401).json({
                  message: "Auth failed at password"
                });
              } else {  // If the password is correct
                const token = jwt.sign( // Create a token  
                  {
                    email: user[0].email,
                    userId: user[0]._id,
                  },
                  process.env.JWT_KEY,{
                    expiresIn: "1h"
                  }
                );
                return res.status(200).json({   // Send the response
                    message: "Auth successful",
                    token,
                    user: user[0]
                });
              }
            })
        })
        .catch(err=>{   // If the find is not done
          console.error(err)
          res.status(500).json({
            error: err
          })
        })
    }
}


