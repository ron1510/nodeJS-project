const Department = require("../models/Departments");
const Employee = require("../models/Employees");

const getAllDepartments = async () => {
    return await Department.find({}).exec();
}

const getDepartmentFullData = async () => {
    const fullData = []
    const departments = await getAllDepartments()

    for (let i = 0; i < departments.length; i++) { 
        const employeesInDepartment = await getAllEmployeesInDepartment(departments[i]._id)
        fullData.push({
            department: departments[i],
            employees: employeesInDepartment
        })
    }
    return fullData
}

const getDepartment = async (id) => {
    return await Department.findById({ _id: id }).exec();
}

const removeEmployeesByDepartment = async (departmentID) => {
    await Employee.deleteMany({ departmentID: departmentID})
}

const getAllEmployeesNotInDepartment = async (departmentID) => { 
    return await Employee.find({ departmentID: { $ne: departmentID } }).exec();
}

const getAllEmployeesInDepartment = async (departmentID) => { 
    return await Employee.find({ departmentID: departmentID }).exec();
}

const removeDepartment = async (id) => { 
    await removeEmployeesByDepartment(id)
    const removedDepartment = await Department.findByIdAndRemove(id)
    if (removedDepartment) {
        return "Removed!"
    }
    return "Could not remove the department"
}

const addEmployeeToDepartment = async (id, employeeID) => {

    const isManager = await checkIsManager(employeeID)
    const foundEmployee = await Employee.findById({ _id: employeeID }).exec();
    //the new department
    const newDepartment = await getDepartment(id);
    //the prev department
    const foundEmpDepartment = await getDepartment(foundEmployee.departmentID);
    foundEmployee.departmentID = id
    await Employee.findByIdAndUpdate(foundEmployee._id, foundEmployee)
    //check if he will be the only one in the department which means he will be the manager
    // if (!newDepartment?.manager || !newDepartment.manager) {
    //     newDepartment.manager = foundEmployee._id
    //     await updateDepartment(newDepartment._id,newDepartment)
    // }
    await firstEmployeeInDepartment(newDepartment, foundEmployee)
    //check if employee was manager
    if (isManager) {
        //if he was promote a diffrent manager if possible if it not remove the department

        //the employees of the prev department
        const foundDepartmentEmployees = await Employee.find({ departmentID: foundEmpDepartment._id }).exec();
        PromoteManagerOrRemoveDepartment(foundDepartmentEmployees, foundEmpDepartment)
        // if (foundDepartmentEmployees.length) {
        //     foundEmpDepartment.manager = foundDepartmentEmployees[0]._id
        //     await updateDepartment(foundEmpDepartment._id, foundEmpDepartment)
        // }
        //!remove department chance to change it it depends on if a department can be empty
        // else {
        //     await removeDepartment(foundEmpDepartment._id)
        // }
    }
    return "Added!"
}

const firstEmployeeInDepartment = async (newDepartment, foundEmployee) => {
    if (!newDepartment?.manager || !newDepartment.manager) {
        newDepartment.manager = foundEmployee._id
        await updateDepartment(newDepartment._id,newDepartment)
    }
}

const PromoteManagerOrRemoveDepartment = async (foundDepartmentEmployees, foundEmpDepartment) => { 
    if (foundDepartmentEmployees.length) {
        foundEmpDepartment.manager = foundDepartmentEmployees[0]._id
        await updateDepartment(foundEmpDepartment._id, foundEmpDepartment)
    }
    //!remove department chance to change it it depends on if a department can be empty
    else {
        await removeDepartment(foundEmpDepartment._id)
    }
}

const updateDepartment = async (id, obj) => {
    const updatedDepartment = await Department.findByIdAndUpdate(id, obj);
    if (!updatedDepartment) {
        return "failed to update department"
    }
    return 'Updated!';
};

const createNewDepartment = async (obj) => {
    const dep = new Department(obj);
    await dep.save();
    return 'Created!';
}

const checkIsManager = async (employeeID) => {
    try {
        const manager = await Department.findOne({ manager: employeeID }).exec()
        if (manager) {
            return true
        }
        return false
    } catch (err) { 
        return false
    }
}

const removeManager = async (manager) => { 
    const foundDepartment = await Department.findOne({ manager: manager }).exec();
    delete foundDepartment.manager;
    await updateDepartment(foundDepartment._id,foundDepartment)
    //await Department.findOneAndRemove({ manager });
    //!chance to change it to remove multiple managers because maybe one employee could be a manager of multiple departments 
    return "Removed!";
}

module.exports = {getAllDepartments, createNewDepartment, checkIsManager, removeManager, getDepartment, updateDepartment, removeDepartment, getAllEmployeesNotInDepartment, addEmployeeToDepartment, firstEmployeeInDepartment, PromoteManagerOrRemoveDepartment, getAllEmployeesInDepartment, getDepartmentFullData}