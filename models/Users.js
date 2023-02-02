const mongoose = require('mongoose');
const { Schema } = mongoose;

const usersSchema = new Schema({
    fullName: String, // String is shorthand for {type: String}
    NumOfAction: Number
});

const User = mongoose.model('User', usersSchema);
module.exports = User;