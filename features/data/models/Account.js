const mongoose = require(`mongoose`);
const {Schema} = mongoose

const accountTypes = require("../../constants/AccountTypes")

const AccountSchema = new Schema({
        name:{
            type:String,
            require:true
        },
        type:{
            type: String,
            enum: Object.values(accountTypes),
            default: accountTypes.accountTypes.INDIVIDUAL
        },
    pin:{
        type:Number,
        require:true
    },
    user:{

    },
    balance:{
        type:Number,
        default:0
    },
    createdAt:{
        type:Date

    }

})
module.exports =