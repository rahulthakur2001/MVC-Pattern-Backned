const ApiError = require('../../utils/ApiError');
const ApiResonse = require('../../utils/ApiResponse');
const userSchema = require('../models/user.model');

const generatePairToken = (user) =>({
   accessToken = user.generateAccessToken(),
   refreshToken =user.generateRefreshToken(),
});


const register = catchAsync(async (req, res) => {

  const { name, email, password } = req.body;

  const userExists = await userSchema.findOne({email});

  if(userExists){
    throw new ApiError('User Email is already exists',409)
  }

  const user = await userSchema.create({
    name,
    email,
    password
  });
 
  const token = generatePairToken(user);
  user.refreshTokens.push({token : token.refreshToken});
  
  await user.save();

  res.cookie('refreshToken',)
});
