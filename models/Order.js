const mongoose=require('mongoose')

const SingleCartItemSchema=mongoose.Schema({
    name:{type:String,required:true},
    image:{type:String,required:true},
    price:{type:Number,required:true},
    amount:{type:Number,required:true},
    product:{
        type:mongoose.Schema.ObjectId,
        ref:'Product',
        require:true
    }
})

const OrderSchema= mongoose.Schema({
    tax:{
        type:Number,
        required:[true,'tax required']
    },
    shippingFee:{
        type:Number,
        required:[true,'shipping fee required']
    },
    subtotal:{
        type:Number,
        required:[true,'subtotal required']
    },
    total:{
        type:Number,
        required:[true,'total required']
    },
    cartItems:[SingleCartItemSchema],
    status:{
        type:String,
        enum:['pending','failed','paid','delivered','cancelled'],
        default:'pending'
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        require:true
    },
    clientSecret:{
        type:String,
        required:true
    },
    paymentIntentId:{
        type:String
    }
    
    
    
},{timestamps:true})

module.exports=new mongoose.model('Order',OrderSchema);