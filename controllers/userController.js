const User=require('../models/User.js')
const {StatusCodes}=require('http-status-codes')
const errors=require('../errors')
 const jwt=require('../utils/jwt')
const utils=require('../utils')

const getAllUsers=async(req,res)=>{
     
    const users=await User.find({role:'user'}).select('-password')
    // const newUser=users.map(u=>{return {"id":u._id,"name":u.name,"email":u.email,"role":u.role}})
    res.status(StatusCodes.OK).json({nbHits:users.length,data:[users]})
    
}

const getSingleUser=async(req,res)=>{
    
    const {userId}=req.params
    utils.checkPermissions(req.user,userId)
    
    if(!userId)
        throw new errors.BadRequestError('Provide user id')
    
    
    const user=await User.findById(userId).select('-password')

    if(!user)
        throw new errors.NotFoundError('User with this id not found')
    
    return res.status(StatusCodes.OK).json(user)
}

const showCurrentUser=async(req,res)=>{
     
    const {user}=req;
    
    res.status(StatusCodes.OK).json(req.user)
}

const updateUser=async(req,res)=>{
    const {name,email}=req.body;

    if(!name || !email)
        throw new errors.BadRequestError('Provide name and email id..')
    
    const user=await User.findOneAndUpdate({_id:req.user.id},{name,email},{new:true,runValidators:true})

    const payload=utils.createTokenUser(user);
    

    await utils.attachCookiesToResponse({res,user:payload})

    res.status(StatusCodes.OK).json({payload})
}

const updateUserPassword=async(req,res)=>{
    const {oldPassword,newPassword}=req.body;
 
    if(!oldPassword || !newPassword)
        throw new errors.BadRequestError('Provide old and new passwords..')

    const user=await User.findOne({_id:req.user.id})

    const isSame=await user.comparePasswords(oldPassword);

    if(!isSame)
        throw  new errors.UnauthenticatedError('Invalid credentials');
    
    user.password=newPassword;

    await user.save();

    res.status(StatusCodes.OK).json({msg:'user pwd updated'});
}

const deleteAllUsers=async(req,res)=>{
    await User.deleteMany({});
    res.status(StatusCodes.OK).json({msg:'all gone!'})
}

module.exports={getAllUsers,getSingleUser,showCurrentUser,
                updateUser,updateUserPassword,deleteAllUsers }