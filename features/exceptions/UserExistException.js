const UserException = require("./UserException");

class UserExistException extends UserException{
    constructor(message){
        super(message)
    }
}

module.exports = UserExistException