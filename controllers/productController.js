const errors=require('../errors')
const {StatusCodes}=require('http-status-codes')
const Product=require('../models/Product')
const utils=require('../utils')
const path=require('path')

const createProduct=async(req,res)=>{
    req.body.user=req.user.id;
    const product=await Product.create(req.body)
    res.status(StatusCodes.CREATED).json(product)
}


const getAllProducts=async(req,res)=>{
    const products=await Product.find({})

   res.status(StatusCodes.OK).json({nbHits:products.length,products})
}

const getSingleProduct=async(req,res)=>{
    const {productId}=req.params;
    if(!productId)
        throw new errors.BadRequestError('No product id provided')
    
    const product=await Product.findById(productId)
                    .populate({path:'reviews',select:'title comment'})

    if(!product)
        throw new errors.NotFoundError('No Product found for this Id');

     res.status(StatusCodes.OK).json(product);
}

const updateProduct=async(req,res)=>{
    const {productId}=req.params;
    if(!productId)
        throw new errors.BadRequestError('No product id provided')
    
    const product=await Product.findByIdAndUpdate(productId,req.body,{new:true,runValidators:true})

    if(!product)
        throw new errors.NotFoundError('No Product found for this Id');
    
    res.status(StatusCodes.OK).json(product);
}
const deleteProduct=async(req,res)=>{
    const {productId}=req.params;
    if(!productId)
        throw new errors.BadRequestError('No product id provided')
    
    const product=await Product.findById(productId)

    if(!product)
        throw new errors.NotFoundError('No Product found for this Id');
    
    await product.remove(); //causes cascade delete for reviews of this product

    res.status(StatusCodes.OK).json({msg:'Product deleted'});
}

const uploadImage=async(req,res)=>{
    console.log(req.files)

    if(!req.files)
        throw new errors.BadRequestError('No image file received')
    
    const {mimetype,size,name,mv}=req.files.image;

    if(!mimetype.startsWith('image'))
        throw new errors.BadRequestError('Please upload image')
    
    const maxsize=1024*1024

    if(size>maxsize)
        throw new errors.BadRequestError('File size cannot exceed 1mb')

    const imagePath=path.join(__dirname,'../public/uploads',`${name}`)

    await mv(imagePath);

    res.status(StatusCodes.OK).json({image:{src:`/uploads/${name}`}})

}

module.exports={createProduct,getAllProducts,getSingleProduct,
                updateProduct,deleteProduct,uploadImage}