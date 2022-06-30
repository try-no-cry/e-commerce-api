const express=require('express')
const orderRouter=express.Router();

// base: /api/v1/orders

const {getAllOrders,getSingleOrder,getCurrentUserOrders,
       createOrder,updateOrder} =require('../controllers/orderController.js')

const {userAuthenticationMiddleware:userAuth,adminAuthenticationMiddleware:adminAuth}=require('../middleware/authentication.js')

orderRouter.get('/',userAuth,adminAuth('admin'),getAllOrders)
orderRouter.get('/showAllMyOrders',userAuth,getCurrentUserOrders)
orderRouter.get('/:orderId',userAuth,getSingleOrder)
orderRouter.post('/',userAuth,createOrder)
orderRouter.patch('/:orderId',userAuth,updateOrder)

module.exports=orderRouter