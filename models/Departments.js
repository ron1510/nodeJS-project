const mongoose = require('mongoose');
const { Schema } = mongoose;

const departmentsSchema = new Schema({
    name: String, // String is shorthand for {type: String}
    manager: {
        type: Schema.Types.ObjectId,
        ref: 'Employee', // this is a not required field because you can make a new department without any employees or manager
    }
});

const Department = mongoose.model('Department', departmentsSchema);
module.exports = Department;