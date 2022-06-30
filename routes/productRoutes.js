const express=require('express')
const productRouter=express.Router()

const {createProduct,getAllProducts,
      getSingleProduct,updateProduct,
      deleteProduct,uploadImage} = require('../controllers/productController.js')

const {getSingleProductReviews}=require('../controllers/reviewController.js')

const {userAuthenticationMiddleware,
       adminAuthenticationMiddleware}=require('../middleware/authentication')

productRouter.get('/',getAllProducts)
productRouter.get('/:productId',getSingleProduct)

productRouter.post('/uploadImage',userAuthenticationMiddleware,adminAuthenticationMiddleware('admin'),uploadImage);
productRouter.post('/',userAuthenticationMiddleware,adminAuthenticationMiddleware('admin'),createProduct);
productRouter.patch('/:productId',userAuthenticationMiddleware,adminAuthenticationMiddleware('admin'),updateProduct);
productRouter.delete('/:productId',userAuthenticationMiddleware,adminAuthenticationMiddleware('admin'),deleteProduct);

productRouter.get('/:productId/reviews',getSingleProductReviews);

module.exports=productRouter;

