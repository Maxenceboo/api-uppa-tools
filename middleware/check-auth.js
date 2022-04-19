const jwt = require('jsonwebtoken');    // import jwt from 'jsonwebtoken'; 

module.exports = (req, res, next) => {  // export a function that takes req, res, next as parameters
    try {   // try to get the token from the header
        const token = req.headers.authorization.split(" ")[1];  // get the token from the header
        const decoded = jwt.verify(token, process.env.JWT_KEY); // decode the token
        req.userData = decoded; // set the userData to the decoded token
        console.log(decoded)    // log the decoded token
        next(); 
    } catch (error) {   // catch the error
        return res.status(401).json({
            message: 'token invalide'
        });
    }
};