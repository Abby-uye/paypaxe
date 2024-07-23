const mongoose = require(`mongoose`);
const {Schema} = mongoose
const addressSchema = require('./userAddress');

const {userStatus} = require("../../constants/userconstants");


const validateEmail = (email)=>  {
    const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email);
};


const UserSchema = new Schema({
    firstName:{
        type:String,
        require:true

    },
    lastName:{
        type:String,
        require:true

    },
    email:{
        type:String,
        unique:true,
        require:true,
        lowercase: true,
        validate:[validateEmail,'Please fill a valid email address']

    },
    phoneNumber:{
      type:Number,
      required:true
    },

    password:{
        type:String,
        require:true

    },
    createdAt:{
        type:Date
    },

    address: {
        type: addressSchema,
    },


    status: {
        type: String,
        enum: Object.values(userStatus),
        default: userStatus.NOT_AUTHENTICATED
    },
    emailConfirmDigits:{
        type:Number
    },
    registerResendCount:{
        type:Number,
        default:0
    },
    expirationTime:{
        type:Date
    }

})

const User = mongoose.model('user', UserSchema);

module.exports = User
