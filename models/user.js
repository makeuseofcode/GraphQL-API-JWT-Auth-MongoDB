const {model, Schema} = require('mongoose');


const userSchema = new Schema({
    name: String,
    password: String,
    role : String

});


module.exports = model('user', userSchema);