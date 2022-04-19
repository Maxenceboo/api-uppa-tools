const User = require('../models/user'); // Import user model

module.exports = { // Export userController 
      upDate: async (req,res,next) =>{  // Update one user 
        const {id,email,username,name,firstname,ressource} = req.body // Get the body of the request 
        await User.updateOne({_id:id},{ // Update the user 
            // set : {
                email: email,
                username: username,
                name: name,
                firstname: firstname,
                ressource: ressource,
            // }
        })
        .exec() // Execute the update
        .then(user =>{  // If the update is done 
            return res.status(200).json({
                message: "good upDate",
                user: user, ///what the fuck 
            });
        })
    },
    getAll: async (req, res, next) => { // Get all users 
        await User.find() // Find all users 
            .select() // Select all fields 
            .exec() // Execute the find 
            .then(docs => { // If the find is done
                const response = {  // Create a response 
                    count: docs.length,
                    users: docs,
                };
                res.status(200).json(response); // Send the response
            })
            .catch(err =>{  // If the find is not done
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    },

  getOne: async (req, res, next) => { // Get one user 
    const id = req.params.id; // Get the id of the user 
    await User.findById({_id : id}) // Find the user 
      .select("_id email password") // Select the fields 
      .exec() // Execute the find
      .then(doc => {  // If the find is done
        console.log("From database", doc);  // Log the user
        if (doc) {  // If the user exist
          res.status(200).json({  // Send the response
            user: doc
          });
        } else {  // If the user doesn't exist
          res.status(400).json({
            message: 'No valide entry found for provided ID'
          });
        }
      })
      .catch(err => { // If the find is not done
        console.log(err);
        res.status(500).json({ error: err });
      });
  },

  
}