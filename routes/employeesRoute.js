const express = require('express');
const employeesBLL = require('../BLL/employeesBLL');

const router = express.Router();

router.route('/')
    .get(async (req, res) => {
        try {
            // const employees = await employeesBLL.getAllEmployees()
            // the header are without capital letters and because i cant send data in a get request
            // i used instead the headers 
            //if the user didnt chose any department to filter from the return value will be all the employees
            
            const { departmentid } = req.headers
            const employees = await employeesBLL.getEmployeesByDepartment(departmentid)
            res.json(employees).status(200)
        } catch (err) {
            res.json({ "error": err.message }).status(400)
        }
    })
    .post(async (req, res) => {
        try {
            const { firstName, lastName, startWorkYear, departmentID } = req.body
            if (!firstName || !lastName || !startWorkYear || !departmentID) {
                res.json({ "error": "must suplly the right data" }).status(400)
            }
            const employee = await employeesBLL.createNewEmployee(req.body)
            res.json(employee).status(200)
        } catch (err) {
            res.json({ "error": err.message }).status(400)
        }
    });
// edit employee route only the get, put and delete
// get employees data and shifts
// delete employee
// edit employee
router.route('/editEmployee/:id')
    .get(async (req, res) => {
        try {
            const { id } = req.params
            const shifts = await employeesBLL.getEmployeeShifts(id)
            const employee = await employeesBLL.getEmployee(id)
            res.json({employee, shifts}).status(200)
        } catch (err) {
            res.json({ "error": err.message }).status(400)
        }
    })
    .put(async (req, res) => {
        try {
            const { id } = req.params
            const updatedEmployee = req.body
            const result = await employeesBLL.updateEmployee(id, updatedEmployee)
            res.json(result).status(200)
        } catch (err) {
            res.json({ "error": err.message }).status(400)
        }
    })
    .delete(async (req, res) => {
        try {
            const { id } = req.params
            const result = await employeesBLL.removeEmployee(id)
            res.json(result).status(200)
        } catch (err) {
            res.json({ "error": err.message }).status(400)
        }
    });

// allocate the employee to an existing shift
router.route('/editEmployee/:id/shifts/:shiftID')
    .post(async (req, res) => {
        try {
            const { id, shiftID } = req.params
            const result = await employeesBLL.allocateEmployeeToShift(shiftID, id)
            res.json(result).status(200)
        } catch (err) {
            res.json({ "error": err.message }).status(400)
        }
    });

//!chance to delete this part because i switched it to be in the get employees route

// router.route('/departments/:departmendID')
//     .get(async (req, res) => {
//         try {
//             const { departmendID } = req.params
//             const result = await employeesBLL.getEmployeesByDepartment(departmendID)
//             res.json(result).status(200)
//         } catch (err) {
//             res.json({ "error": err.message }).status(400)
//         }
//     });


module.exports = router;