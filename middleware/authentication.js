const utils=require('../utils')
const errors=require('../errors')
const User = require('../models/User')

const userAuthenticationMiddleware=async(req,res,next)=>{
    const token=req.signedCookies.token
    if(!token)
     throw new errors.BadRequestError('No token present')
    
     try{
        const {payload}= utils.isTokenValid(token);
       
       
        req.user={name:payload.name,id:payload.id,role:payload.role}
        
        next()
    }
    catch(error)
    {
        throw new errors.UnauthenticatedError('Invalid token!')
    }
    
    
}

const adminAuthenticationMiddleware=(...roles)=>{
    
    return ((req,res,next)=>{
         
       if(!roles.includes(req.user.role))
             throw new errors.UnauthorizedError('You are not allowed to access this route. Contact admin!')
       next()
   })
   
}

// const authorizeUser=async(req,res,next)=>{
//     // adminAuthenticationMiddleware(req,res,next)

//     const {email}=req.body;

//     await User.updateOne({email},{role:'admin'})

//     console.log('Admin added')

//     next()
    
// }

module.exports={userAuthenticationMiddleware,adminAuthenticationMiddleware}