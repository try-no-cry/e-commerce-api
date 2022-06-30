const jwt=require('jsonwebtoken')
const errors=require('../errors')

const createJWT=async (payload)=>{
    const token=await jwt.sign(payload,process.env.JWT_SECRET,
                                {expiresIn:process.env.JWT_LIFETIME})
   return token;
}

const isTokenValid=(token)=>{
    return  jwt.verify(token,process.env.JWT_SECRET);
}


const attachCookiesToResponse=async ({res,user})=>{
    
    const token=await createJWT({payload:user})

    const oneDay=1000*60*60*24*30

     res.cookie('token',token,{
        httpOnly:true,
        expiers:new Date(Date.now()+oneDay),
        secure:process.env.NODE_ENV==='production',
        signed:true
    })

      

    // res.status(201).json({success:true,user})


}

module.exports={createJWT,isTokenValid,attachCookiesToResponse};