const User = require('../models/user');

module.exports = { 
      upDate: async (req,res,next) =>{
        const {id,email,username,name,firstname,ressource} = req.body
        await User.updateOne({_id:id},{
            // set : {
                email: email,
                username: username,
                name: name,
                firstname: firstname,
                ressource: ressource,
            // }
        })
        .exec()
        .then(user =>{
            return res.status(200).json({
                message: "good upDate",
                user: user, ///what the fuck 
            });
        })
    },
    getAll: async (req, res, next) => {
        await User.find()
            .select()
            .exec()
            .then(docs => {
                const response = {
                    count: docs.length,
                    users: docs,
                };
                res.status(200).json(response);
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    },

  getOne: async (req, res, next) => {
    const id = req.params.id;
    await User.findById({_id : id})
      .select("_id email password")
      .exec()
      .then(doc => {
        console.log("From database", doc);
        if (doc) {
          res.status(200).json({
            user: doc
          });
        } else {
          res.status(400).json({
            message: 'No valide entry found for provided ID'
          });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  },

  
}