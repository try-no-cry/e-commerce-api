require('dotenv').config()    
require('express-async-errors')
const express=require('express')
const connectDB = require('./db/connect.js')
const fileUpload=require('express-fileupload')
const app=express()



//middlewares
const notFoundMiddleware=require('./middleware/not-found')
const errorHandlerMiddleware=require('./middleware/error-handler')
const morgan=require('morgan')
const cookieParser=require('cookie-parser')
 

//routes
const authRoutes=require('./routes/authRoutes.js')
const userRoutes=require('./routes/userRoutes.js')
const productRoutes=require('./routes/productRoutes.js')
const reviewRoutes=require('./routes/reviewRoutes.js')
const orderRoutes=require('./routes/orderRoutes.js')

const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');


app.use(express.json())
// app.use(morgan('tiny'))
app.use(cookieParser(process.env.JWT_SECRET))
app.use(express.static('./public'))
app.use(fileUpload())



app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());


// app.get('/',(req,res)=>{res.send('eCommerce me swagat hai!')})
// app.get('/api/v1',(req,res)=>{
    
//     console.log("signed",req.signedCookies);
//     res.send('eCommercafgmle me swagat hai!')
// })

app.use('/api/v1/auth',authRoutes)
app.use('/api/v1/users',userRoutes)
app.use('/api/v1/products',productRoutes)
app.use('/api/v1/reviews',reviewRoutes);
app.use('/api/v1/orders',orderRoutes);

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port=process.env.PORT || 5000

const start=async ()=>{
    try{
        //connect to mongo db
        await connectDB(process.env.MONGO_URI)
        console.log(`Connected to mongo db..`)
        app.listen(port,()=>console.log(`Server listening at port ${port}`))
    }
    catch(error)
    {
        console.log(error)
    }
}

start()