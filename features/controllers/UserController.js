const {registerUser,verify,resendCode,getUserDetails,updateUserDetails} = require("../services/UserService")
const UserException = require("../exceptions/UserException");
const NotAValidPasswordException = require("../exceptions/NotAValidPasswordException");


const register = async(registerUserRequest,registerUserResponse) => {
    try {
        const registerResponse = await registerUser(registerUserRequest.body);
        registerUserResponse.json(registerResponse);
    } catch (error) {
        registerUserResponse.status(500).json({
            message: 'An error occurred during registration',
            error: error.message
        });

    }
}

const verifyUser = async (verifyUserRequest, verifyUserResponse) => {
    try {
        const verifyResponse = await verify(verifyUserRequest);
        verifyUserResponse.json(verifyResponse);
    } catch (error) {
        if (error instanceof UserException) {
            return  verifyUserResponse.status(error.statusCode).json({ error: error.message });
        }
        else {
            console.error(error, "internal server error");
            return   verifyUserResponse.status(500).json();

        }
    }
};


const resendCodeToUser= async (resendCodeToUserRequest,resendCodeToUserResponse)=>{
    try {
        const resendResponse = await resendCode(resendCodeToUserRequest)
        resendCodeToUserResponse.json(resendResponse)
    }
    catch (error){
        if (error instanceof UserException) {
            return  resendCodeToUserResponse.status(error.statusCode).json({ error: error.message });
        }
        else {
            console.error(error, "internal server error");
            return   resendCodeToUserResponse.status(500).json();

        }
    }
}
const getPaypaxeUserDetails = async (getUserDetailsRequest,getUserDetailsResponse)=>{
    try{
        const userDetailsResponse = await getUserDetails(getUserDetailsRequest)
        getUserDetailsResponse.json(userDetailsResponse)
    }
    catch (error){
        if (error instanceof UserException) {
            return  getUserDetailsResponse.status(error.statusCode).json({ error: error.message });
        }
        else {
            console.error(error, "internal server error");
            return   getUserDetailsResponse.status(500).json();

        }
    }
}
const updatePaypaxeUser = async (updateUserRequest,updateUserResponse)=> {
    try {
        const updateResponse = await updateUserDetails(updateUserRequest)
        updateUserResponse.json(updateResponse)
    } catch (error) {
        if (error instanceof NotAValidPasswordException) {
            return updateUserResponse.status(error.statusCode).json({error: error.message});
        } else {
            console.error(error, "internal server error");
            return updateUserResponse.status(500).json();
        }
    }
}
module.exports = {register,verifyUser,resendCodeToUser,getPaypaxeUserDetails,updatePaypaxeUser}