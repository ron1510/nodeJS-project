const Shift = require("../models/Shifts");
const Employee = require("../models/Employees");

const getAllShifts = async () => {
    return await Shift.find({}).exec();
}

const getShift = async (id) => {
    return await Shift.findById({_id: id}).exec();
}

const addNewShift = async (obj) => { 
    const shift = new Shift(obj);
    await shift.save();
    return "Created"
}

const updateShift = async (id, updatedShift) => { 
    const prevShift = await Shift.findByIdAndUpdate(id, updatedShift);
    if (!prevShift) {
        return "failed to update shift"
    }
    return 'Updated!';
}

const allocateShiftToEmployee = async (id, employeeID) => {
    //find the employee
    const foundEmployee = await Employee.findById({ _id: employeeID }).exec();
    if (!foundEmployee) {
        return "employee not found"
    }
    const shiftToAdd = await Shift.findById({ _id: id }).exec();
    if (!shiftToAdd) {
        return "shift not found"
    }
    //add the shift to the employees array of shifts
    foundEmployee.shifts.push(shiftToAdd._id)
    //update the employee 
    await Employee.findByIdAndUpdate(employeeID, foundEmployee);
    return "Alocated"
}

module.exports = {getAllShifts, getShift, addNewShift, updateShift, allocateShiftToEmployee}