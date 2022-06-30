const errors=require('../errors')
const utils=require('../utils')
const {StatusCodes}=require('http-status-codes')
const Review=require('../models/Review')
const User=require('../models/User')
const Product=require('../models/Product')

const createReview=async(req,res)=>{
    const {product:productId}=req.body
    req.body.user=req.user.id
    
    console.log(req.body)
    const product=await Product.findById(productId)

    if(!product)
        throw new errors.NotFoundError('Product Not found')
    
    const alreadySubmitted=await Review.find({user:req.user.id,product:productId})

    if(alreadySubmitted.length>0)
        throw new errors.CustomAPIError('Review for this product is already submitted by you!')

    const review=await Review.create(req.body)

    res.status(StatusCodes.CREATED).json(review)
}

const getAllReviews=async(req,res)=>{
    const reviews=await Review.find({})
                            .populate({path:'product',select:'name company price'})
                            .populate({path:'user',select:'name'})
    res.status(StatusCodes.OK).json({count:reviews.length,reviews})
}

const getSingleReview=async(req,res)=>{
    const {reviewId}=req.params;
    if(!reviewId)
        throw new errors.BadRequestError('Review Id not received')
    
     const review=await Review.findById(reviewId)

     if(!review)
        throw new errors.NotFoundError('No review found with given id')
    
    res.status(StatusCodes.OK).json(review)

}

const updateReview=async(req,res)=>{
    const {reviewId}=req.params;
    const {rating,comment,title}=req.body;
  
    if(!reviewId)
        throw new errors.BadRequestError('Review Id not received')
    
    
     const review=await Review.findById(reviewId)

     if(!review)
        throw new errors.NotFoundError('No review found with given id')

     utils.checkPermissions(req.user,review.user)

    if(rating)
        review.rating=rating;
    if(comment)
        review.comment=comment;
    if(title)
        review.title=title;

    await review.save();
    
    res.status(StatusCodes.OK).json({review})
   
}

const deleteReview=async(req,res)=>{

    const {reviewId}=req.params;
    if(!reviewId)
        throw new errors.BadRequestError('Review Id not received')
    
    
     const review=await Review.findById(reviewId)

     if(!review)
        throw new errors.NotFoundError('No review found with given id')

    utils.checkPermissions(req.user,review.user)

   
    await review.remove();

    res.status(StatusCodes.OK).json({msg:'Review deleted'})
}

const deleteAllReviews=async(req,res)=>{
    await Review.deleteMany({})
    res.send('ALL DELETED')
}

const getSingleProductReviews=async(req,res)=>{
    const {productId}=req.params;
    const reviews=await Review.find({product:productId});
    res.status(StatusCodes.OK).json({count:reviews.length,reviews})
}

module.exports={deleteAllReviews,createReview,getAllReviews,
                getSingleReview,updateReview,deleteReview,getSingleProductReviews}