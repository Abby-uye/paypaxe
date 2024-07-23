class NotAValidPasswordException extends Error{
    constructor(message) {
        super(message);
    }
}
module.exports  = NotAValidPasswordException