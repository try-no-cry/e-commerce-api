const express=require('express')
const reviewRouter=express.Router()

const {createReview,getAllReviews,deleteAllReviews,
    getSingleReview,updateReview,deleteReview}=require('../controllers/reviewController')

const {userAuthenticationMiddleware}=require('../middleware/authentication')

reviewRouter.get('/',getAllReviews)
reviewRouter.get('/deleteAll',deleteAllReviews)
reviewRouter.get('/:reviewId',getSingleReview)
reviewRouter.post('/',userAuthenticationMiddleware,createReview)
reviewRouter.patch('/:reviewId',userAuthenticationMiddleware,updateReview)
reviewRouter.delete('/:reviewId',userAuthenticationMiddleware,deleteReview)

module.exports=reviewRouter;