const mongoose = require('mongoose');
const { Schema } = mongoose;

const employeesSchema = new Schema({
    firstName: String, // String is shorthand for {type: String}
    lastName: String, // String is shorthand for {type: String}
    startWorkYear: Number,
    departmentID: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Department', // this is a required field because you cant make a new employee that are not inside a department
    },
    shifts: {
        required: true,
        type: [Schema.Types.ObjectId],
        ref: 'Shift',
        default: []
    }

});

const Employee = mongoose.model('Employee', employeesSchema);
module.exports = Employee;