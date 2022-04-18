const mongoose = require('mongoose');

const usertemplate = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,


    email: { type: String, required: true},
    password: { type: String, required: true},

    
    avatar: { type: String, require: false},

    username: { type: String, required: false},
    name: { type: String, required : false},
    firstname: { type: String, required : false},

    ressource: { type: Number, required : false},

})

module.exports = mongoose.model('user', usertemplate);