const mongoose = require('mongoose');

const User = require('../models/user');

const bcrypt = require("bcryptjs");


const jwt = require("jsonwebtoken");

const regexp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/ 

module.exports = {
    
    signup: async (req, res, next) =>{
        const {email, password} = req.body
        await User.find({email})
        .exec()
        .then(user => {
            if (user.length >= 1 ){
                return res.status(409).json({
                    message: "Email already exists"
                });
            }else if(!regexp.test(email)){
                return res.status(400).json({
                    message: "ntm rentre un email"
                });
            } else {
                bcrypt.hash(req.body.password, 11, (err, hash) =>{
                    if (err){
                        return res.status(401).json({
                            error: err
                        });
                    } else {
                        id = new mongoose.Types.ObjectId()
                        const user = new User({
                            _id : id,
                            email : req.body.email,
                            password: hash,
                            username: "",
                            name: "",
                            firstname: "",
                            ressource: 0,
                        });
                        user.save()
                            .then(result =>{
                                res.status(201).json({
                                    message: "User created"
                                });
                            })
                            .catch(err => {
                                res.status(401).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        });
    },
    
    signin: async (req, res, next) => {
        User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length < 1 ) {
                return res.status(401).json({
                    message: "No existing user with that email."
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, resultat)=>{
              if(!resultat) {
                return res.status(401).json({
                  message: "Auth failed at password"
                });
              } else {
                const token = jwt.sign(
                  {
                    email: user[0].email,
                    userId: user[0]._id,
                  },
                  process.env.JWT_KEY,{
                    expiresIn: "1h"
                  }
                );
                return res.status(200).json({
                    message: "Auth successful",
                    token,
                    user: user[0]
                });
              }
            })
        })
        .catch(err=>{
          console.error(err)
          res.status(500).json({
            error: err
          })
        })
    }
}


