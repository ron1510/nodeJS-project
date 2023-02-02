const Employee = require("../models/Employees");
const {checkIsManager, getDepartment, updateDepartment, removeDepartment, firstEmployeeInDepartment, PromoteManagerOrRemoveDepartment} = require('./departmentsBLL')
const { allocateShiftToEmployee } = require('./shiftsBLL')

const getAllEmployees = async () => {
    return await Employee.find({}).exec();
}

const getEmployee = async (id) => {
    return await Employee.findById({_id: id}).exec();
}

const getEmployeesByDepartment = async (departmentID) => {
    if (!departmentID) {
        return await getAllEmployees()
    }
    return await Employee.find({ departmentID: departmentID }).exec();
}

const getEmployeeShifts = async (id) => {
    const foundEmployee = await getEmployee(id)
    return foundEmployee.shifts
}

const allocateEmployeeToShift = async (shiftsID, id) => {
    return await allocateShiftToEmployee(shiftsID, id)
}

const createNewEmployee = async (obj) => { 
    const emp = new Employee(obj);
    await emp.save();
    //check for the manager of the department if there is no manager promote the employee to be the manager
    //else do nothing
    const empDepartment = await getDepartment(emp.departmentID)
    // if (!empDepartment?.manager || !empDepartment.manager) {
    //     empDepartment.manager = emp._id
    //     await updateDepartment(empDepartment._id,empDepartment)
    // }
    firstEmployeeInDepartment(empDepartment, emp)
    return 'Created!';
}

const updateEmployee = async (id, obj) => {
    const updatedEmployee = await Employee.findByIdAndUpdate(id, obj);
    if (!updatedEmployee) {
        return "failed to update employee"
    }
    return 'Updated!';
};

const removeEmployee = async (id) => {
    const foundEmployee = await getEmployee(id)
    //check if the employee exists
    if (!foundEmployee) { 
        return 'failed to find employee'
    }
    //check if this employee is a manager of a department
    if (checkIsManager(id)) {
        const empDepartment = await getDepartment(foundEmployee.departmentID)

        //remove the employee
        await Employee.findByIdAndRemove(id);
        // find the department that the manager manages
        const foundDepartmentEmployees = await Employee.find({ departmentID: empDepartment._id }).exec();
        
        // promote a new manager if possible if not you might as well remove it
        // to see if its possible to promote another manager you need to look for an employee that in this department
        // and the first you find will be promoted

        //make manager
        PromoteManagerOrRemoveDepartment(foundDepartmentEmployees, empDepartment)
        // if (foundDepartmentEmployees.length) {
        //     empDepartment.manager = foundDepartmentEmployees[0]._id
        //     await updateDepartment(empDepartment._id, empDepartment)
        // }
        // //!remove department chance to change it it depends on if a department can be empty
        // else {
        //     await removeDepartment(empDepartment._id)
        // }
    }
    return 'Removed!';
};


module.exports = {getAllEmployees, createNewEmployee, updateEmployee, removeEmployee, getEmployee, getEmployeesByDepartment, getEmployeeShifts, allocateEmployeeToShift}