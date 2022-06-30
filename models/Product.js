const mongoose=require('mongoose')

const ProductSchema=new mongoose.Schema({
    name:
    {
        type:String,
        required:[true,'Product name is required'],
        trim:true,
        maxlength:[100,'Name cannot be more than 100 characters']
    },
    price:
    {
        type:Number,
        required:[true,'Product price is required'],
        default:0
    },
    description:
    {
        type:String,
        required:[true,'Product description is required'],
        maxlength:[1024,'Description cannot be more than 1024 characters']
    },
    image:
    {
        type:String,
        required:[true,'Product image is required'],
        default:'/uploads/example.jpeg'
    },
    category:
    {
        type:String,
        required:[true,'Product category is required'],
        enum:['office','kitchen','bedroom'],

    },
    company:
    {
        type:String,
        required:[true,'Product company is required'],
        enum:{
            values:['ikea','liddy','marcos'],
            message:'{VALUE} is not supported'
        }
    },
    colors:
    {
        type:[String],
        required:[true,'Product colors is required'],
        default:['#222']
    },
    featured:
    {
        type:Boolean,
        default:false
    },
    freeShipping:
    {
        type:Boolean,
        default:false
    },
    inventory:
    {
        type:Number,
        required:true,
        default:1
    },
    averageRating:
    {
        type:Number,
        default:0,
        
    },
    noOfReviews:
    {
        type:Number,
        default:0,
        
    },
    user:
    {
        type:mongoose.Types.ObjectId,
        required:[true,'Product name is required'],
        ref:'User'
    },
},
    {timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true}}
)

ProductSchema.virtual('reviews',{
    ref:'Review',
    localField:'_id',
    foreignField:'product',
    justOne:false,
    // match:{rating:5}
    
})

ProductSchema.pre('remove',async function(){
    await this.model('Review').deleteMany({product:this._id});
})

module.exports= mongoose.model('Product',ProductSchema);