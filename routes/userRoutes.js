const express=require('express')
const userRouter=express.Router()
const app=express()
 // base: api/v1/users

const {getAllUsers,getSingleUser,
       showCurrentUser,updateUser,
       updateUserPassword,
       deleteAllUsers}=require('../controllers/userController.js')

const {userAuthenticationMiddleware,adminAuthenticationMiddleware}=require('../middleware/authentication')

userRouter.get('/',userAuthenticationMiddleware,adminAuthenticationMiddleware('admin','owner'),getAllUsers)

app.use(userAuthenticationMiddleware)

userRouter.get('/showMe',userAuthenticationMiddleware,showCurrentUser)
userRouter.get('/deleteAll',deleteAllUsers)
userRouter.get('/:userId',userAuthenticationMiddleware,getSingleUser)
userRouter.patch('/updateUserPassword',userAuthenticationMiddleware,updateUserPassword)
userRouter.patch('/updateUser',userAuthenticationMiddleware,updateUser)


module.exports=userRouter