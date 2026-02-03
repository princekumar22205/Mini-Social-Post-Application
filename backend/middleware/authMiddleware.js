const jwt = require("jsonwebtoken");

module.exports = (req, res, next)=>{

    const token = req.headers.authorization?.split(" ")[1]

    if(!token){
        return res.status(401).json({message:"token not found"})
    }
    try{
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        req.User = decode;
        next();
    }
    catch(err){
        res.status(401).json({message:"invalid token"});
    }
}