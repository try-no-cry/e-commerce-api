const mongoose=require('mongoose')

const ReviewSchema=new mongoose.Schema({
    rating:{
        type:Number,
        min:1,
        max:5,
        required:[true,'Please provide rating..']
    },
    title:{
        type:String,
        trim:true,
        required:[true,'Please provide title..'],
        maxlength:100
    },
    comment:{
        type:String,
        required:[true,'Please comment on the products..'],
        trim:true,
        maxlength:500
    },
    user:{
        type:mongoose.Schema.ObjectId,
        required:[true,'User Id required'],
        ref:'User'
    },
    product:{
        type:mongoose.Schema.ObjectId,
        required:[true,'Product Id required'],
        ref:'Product'
    }
},{timestamps:true}
)

//setting compound index
ReviewSchema.index({product:1,user:1},{unique:true})

ReviewSchema.statics.calculateAverageRating=async function(productId){
    // console.log(productId);
    const res=await this.aggregate([
        {$match:{product:productId}},
        {$group:{
            _id:'$product',
            averageRating:{$avg:'$rating'},
            numOfReviews:{$sum:1},
        }}
    ]);

    try{
        await this.model('Product').findOneAndUpdate({_id:productId},{
            averageRating:Math.ceil(res[0]?.averageRating || 0),
            numOfReviews:res[0]?.numOfReviews || 0,
        })
    }catch(err)
    {
        console.log(err);
    }

    console.log(res);
}

ReviewSchema.post('save',async function(){
    await this.constructor.calculateAverageRating(this.product)
    console.log('post save hook called')
})

ReviewSchema.post('remove',async function(){
    await this.constructor.calculateAverageRating(this.product)
    console.log('post save hook called')
})


module.exports=mongoose.model('Review',ReviewSchema); 