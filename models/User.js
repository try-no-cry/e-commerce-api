const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const validator=require('validator')

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please provide name.']
    },
    email:{
        type:String,
        unique:true,
        required:[true,'Please provide a valid email address'],
        validate:{
            validator:validator.isEmail,
            message:'Please provide valid email'
        }
    },
    password:{
        type:String,
        required:[true,'Input password'],
        minlength:3
    },
    role:{
        type:String,
        enum:['admin','user'],
        default:'user',
    }
})

UserSchema.pre('save', async function(){
    console.log(this.modifiedPaths())
    console.log(this.isModified('name'))

    if(!this.isModified('password')) return;

    const salt=await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password,salt);
})

UserSchema.methods.comparePasswords=async function(candidatePwd)
{
   const isMatch= await bcrypt.compare(candidatePwd,this.password);
   return isMatch;
}

module.exports=mongoose.model('User',UserSchema);