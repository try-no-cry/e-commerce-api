const Order=require('../models/Order.js')
const Product=require('../models/Product.js')
const errors=require('../errors')
const {StatusCodes}=require('http-status-codes')
const {checkPermissions}=require('../utils')

const getAllOrders=async(req,res)=>{
    // checkPermissions(req.user,)
    const orders=await Order.find()
    res.status(StatusCodes.OK).json({count:orders.length,orders})
}


const getSingleOrder=async(req,res)=>{
    const {orderId}=req.params;
    if(!orderId)
        throw new errors.BadRequestError('No order id present')

    const order=await Order.find({_id:orderId})
    checkPermissions(req.user,order.user)
    res.status(StatusCodes.OK).json({order})
}

const getCurrentUserOrders=async(req,res)=>{

    const orders=await Order.find({user:req.user.id})
    res.status(StatusCodes.OK).json({count:orders.length,orders})
}

const FakeStripeAPI=async({amount,currency})=>{
    const client_secret='someval';
    return {client_secret,amount};
}

const createOrder=async(req,res)=>{

    const {items:cartItems,tax,shippingFee}=req.body;
    if(!cartItems || cartItems.length<1)
        throw new errors.BadRequestError('No cart items provided')
    
    if(!tax || !shippingFee)
        throw new errors.BadRequestError('Tax and Shipping fee missing!')

    let orderItems=[];
    let subtotal=0;
    for(const item of cartItems)
    {
        const dbProduct=await Product.findOne({_id:item.product})
        if(!dbProduct)
            throw new errors.NotFoundError(`No Product with id:${item.product}`)
        
        const {name,price,image,_id}=dbProduct;
        console.log({name,price,image,_id})

        const singleOrderItem={
            amount:item.amount,
            name,
            price,
            image,
            product:_id
        };

        orderItems=[...orderItems,singleOrderItem]
        
        subtotal  +=item.amount*price;     
    }
    
    const total=tax + shippingFee + subtotal;
    //get clientsecret
    const paymentIntent=await FakeStripeAPI({
        amount:total,
        currency:'usd'
    })

    const order=await Order.create({
        cartItems:orderItems,total,subtotal,tax,shippingFee,clientSecret:paymentIntent.client_secret,
        user:req.user.id
    })
    console.log(order) 
    res.status(StatusCodes.CREATED).json({order,clientSecret:order.clientSecret})
}

const updateOrder=async(req,res)=>{
    const {orderId}=req.params;
    const{paymentIntentId}=req.body;

    if(!orderId || !paymentIntentId)
        throw new errors.BadRequestError('No order id present or paymentIntentId missing')


    const order=await Order.findOne({_id:orderId})

    if(!order)
        throw new errors.NotFoundError('No order found with this id')
    
    checkPermissions(req.user,order.user);

    order.paymentIntentId=paymentIntentId;
    order.status='paid';
    await order.save();

    res.status(StatusCodes.OK).json({order})
}

 module.exports={getAllOrders,getSingleOrder,getCurrentUserOrders,
                 createOrder,updateOrder}
 
