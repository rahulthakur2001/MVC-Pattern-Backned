const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const config  = require("../config/env");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email address is requried"],
    trim: true,
    unique: true,
    lowercase: true,
    index: true,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password must be at least 8 characters"],
    select: false,
  },
  role:{
     type:String,
     enum:['user','admin']
  },
  isActive:{
    type:Boolean,
    default:false,
  },
  isEmailVerified:{
    type:Boolean,
    default:false,
  },
  fcmToken:{
    type:String,
  },
  refreshTokens:[
    {
       token:{
         type:String,
         select:false
       },
       createdAt:{
        type:String,
        default:Date.now
       }
    },
  ]
  
},{timestamps:true});


userSchema.index({role:1, isActive: 1});

userSchema.pre('save', async function hashPassowrd(next) {
  if(!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, config.bcryptSaltRounds);
});
 

userSchema.methods.caomparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAccessToken = function generateAccessToken(){
  return jwt.sign({
    id:this._id,
    role:this.role,
  },
  config.jwt.accessSecret,{
    expiresIn:config.jwt.accessExpiresIn,
  });
};


userSchema.methods.generateRefreshToken =  async function(){
  return jwt.sign({
    id:this._id,
    role:this.role,
  },config.jwt.refreshSecret,{
    expiresIn:config.jwt.refreshExpiresIn
  });
};


module.exports = mongoose.model('User',userSchema);

