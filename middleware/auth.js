const jwt = require("jsonwebtoken")

// import the jwtsecret key
const JWT_SECRET= process.env.JWT_SECRET

// Below middleware is going to protect differnt routes of our application
function auth(req, res, next){
    // get the authorization header from the incoming request
    const authHeader = req.headers.authorization;

    // console.log("The content of the auth header are",authHeader)

    // extract the token
    const token = authHeader && authHeader.split(' ')[1]

    // console.log("The token is:",token)

    // check wheather the token sent contains authorization token
    if(!token){
        return res.status(401).json({message: "Blocked from accessing....! No authorization token provided."})
    }
    // if the token is there, check whether is valid or not
    try{
        // verify the token using the secret key
        // if its valid, decord it and store inside of the req.user
        const decord = jwt.verify(token, JWT_SECRET)
        req.User = decord
        //  if the token is verified and it is correct, move to the next step
        next()
    }
    catch(err){
        res.status(403).json({message : "Invalid token"})
    }
}

// export the module to make it accessible all over
module.exports = auth;