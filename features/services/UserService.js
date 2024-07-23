User =  require("../data/models/User")
const UserExistException = require("../exceptions/userExistException");
const UserException = require("../exceptions/userException");
const {sendWelcomeEmail} = require("../utils/nodeMailer");
const generator = require("../utils/generateOtp")
 const {hashPassword}= require("../utils/passwordHasher")
const redisClient = require('../data/repository/connectToRedisDatabase');
const {userStatus} = require("../constants/userconstants");
const jsonPatch = require('fast-json-patch');
const NotAValidPasswordException = require("../exceptions/NotAValidPasswordException");



const registerUser = async(registrationRequest)=>{
    let otp = generator.generateOtp()
    let expirationTime = Date.now() + 15 * 60 * 1000;
    const {firstName, lastName, email, password} = registrationRequest;
    const user = await User.findOne({email});

    if (user) {
        throw new UserExistException("this email is already in use")
    }
    console.log('Received password:', password);
    if(!validPassword(password)){
        throw new Error("Password does not match criteria")
    }
    const hashedPassword = await hashPassword(password)
    const newUser = {
        firstName,
        lastName,
        email,
        password:hashedPassword,
        emailConfirmDigits: otp,
        expirationTime,
        createdAt:Date.now()

    }
    const savedUser = await User.create(newUser)
    const response = {
        firstName: savedUser.firstName,
        lastName:savedUser.lastName,
        email: savedUser.email,
    }

    registerMailSender(email,firstName+lastName,otp)
    return {
        data: response,
        message: "Registration successful"

    }


}
const validPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const result = passwordRegex.test(password);
    console.log('Password:', password);
    console.log('Validation result:', result);
    return result;
};
const registerMailSender = (email,fullName,emailConfirmDigits)=>{
    let subject= 'Welcome to the Easy Banking!'
    let  text= `Hello ${fullName},\n\nWelcome to the Easy Banking! We are glad to have you on board.\n\nPlease enter this 6 digits to confirm your email ${emailConfirmDigits}\n\nBest Regards,\nEasy Banking team`

    sendWelcomeEmail(email, fullName,emailConfirmDigits, subject, text)
}


const verify = async (verifyUserRequest, verifyUserResponse) => {
    const { email, verificationCode } = verifyUserRequest.body;

    console.log(verificationCode)
    const user = await User.findOne({ email });


    if (!user) {
        verifyUserResponse.status(400).send('User not found');
    }


    if (Date.now() > user.expirationTime.getTime()) {
        console.log(user.expirationTime)
        throw new UserException("verification code expired");
    }

    console.log(user.emailConfirmDigits===verificationCode);


    if (user.emailConfirmDigits === verificationCode) {
        console.log("Verification code matches");

        console.log(user.emailConfirmDigits)
        user.status = userStatus.AUTHENTICATED;


        await user.save();

        return 'Registration complete';
    }
    else {
        throw new Error("Invalid verification code")
    }

};





const resendCode = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({email});

    if (!user) {
        throw new UserExistException('User not found');
    }

    if (user.registerResendCount >= 3) {
        User.deleteOne({email})
        throw new UserException('Maximum resend attempts reached. Please restart registration process.');
    }
    let emailConfirmDigits = generator.generateOtp()
    user.registerResendCount+=1;
    user.emailConfirmDigits = emailConfirmDigits
    user.expirationTime = Date.now() + 15 * 60 * 1000;

    registerMailSender(email, user.firstName+user.lastName,emailConfirmDigits);
    await user.save()
    return 'Verification code resent'
};
const getUserDetails = async (userDetailsRequest)=>{
    const {email} = userDetailsRequest;

    const user = await User.findOne(email)
    if(!user){

        throw new UserExistException("Not an existing user")
    }
    return {
        firstName: user.firstName,
        lastName:user.lastName,
        email:user.email,
        phone:user.phoneNumber
    }
}

const updateUserDetails =  async (updateUserRequest)=>{
    const{password,id,fields} = updateUserRequest
    let user = await User.findOne(id);
    if(!user){
        throw new UserExistException("Not an valid user")
    }
        if (!await accuratePassword(password, user.password)){
            throw new NotAValidPasswordException("incorrect password")
        }
    const patch = buildPatchOperations(fields);
    const originalUser = user.toObject();
    const updatedUser = jsonPatch.applyPatch(originalUser, patch).newDocument;

    user.set(updatedUser);
    await user.save();
}

const accuratePassword = async (providedPassword, storedHashedPassword) => {
    return await bcrypt.compare(providedPassword, storedHashedPassword);
};

const buildPatchOperations = (request) => {
    const jsonPatchOperations = [];
    const fields = Object.keys(request);

    fields.forEach((field) => {
        if (isValidUpdate(request[field])) {
            addOperation(field, request[field], jsonPatchOperations);
        }
    });

    return jsonPatchOperations;
};
const isValidUpdate = (field, value) => {
    const excludedFields = ['_id', 'status','emailConfirmDigits','registerResendCount','expirationTime','createdAt']; // List of fields to exclude
    return value !== null && value !== undefined && !excludedFields.includes(field);
};
const addOperation = (field, value, jsonPatchOperations) => {
    jsonPatchOperations.push({
        op: 'replace',
        path: `/${field}`,
        value: value
    });
};
module.exports = {registerUser,verify,resendCode,getUserDetails,updateUserDetails}
