const User=require('../models/User.js')
const {BadRequestError,UnauthenticatedError}=require('../errors')
const {StatusCodes}=require('http-status-codes')
const {attachCookiesToResponse}=require('../utils')
const utils=require('../utils')

const login=async (req,res)=>{
    const {email,password}=req.body;

    if(!email || !password)
        throw new BadRequestError('Input email and password!')
    
    const user=await User.findOne({email});

    if(!user)
        throw new BadRequestError('Email or password is wrong')
    
    const isPwdCorrect=await user.comparePasswords(password);
    
    if(!isPwdCorrect)
     throw new UnauthenticatedError('Invalid credentials')
    
    
     const payload=utils.createTokenUser(user)

     await attachCookiesToResponse({res,user:payload})

    res.status(StatusCodes.OK).json({user})
}

const logout=async (req,res)=>{
    await res.cookie('token','logout',{
        httpOnly:true,
        expires:new Date(Date.now())
    })
    res.status(200).json({msg:"logged out!"})
}

const register=async (req,res)=>{
    const {name,email,password}=req.body;
 
    if(!name || !email || !password)
        throw new BadRequestError('Provide all details..')
    
    const isFirstAccount=(await User.countDocuments())===0;

    let role="user";

    if(isFirstAccount)
        role="admin";
     

    const user=await User.create({name,email,password,role})

    const payload=utils.createTokenUser(user);

    await attachCookiesToResponse({res,user:payload})
    
    res.status(StatusCodes.CREATED).json({success:true,user:{name,role}})
}

module.exports={login,logout,register}