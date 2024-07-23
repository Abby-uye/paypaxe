

const generateOtp = (length = 6)=>{
    let otp = ""

    for (let count = 0; count < length; count++){
        otp += Math.floor(Math.random()*10)
    }
    return otp
}
module.exports = {generateOtp}