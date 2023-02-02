const express = require('express');
const departmentsBLL = require('../BLL/departmentsBLL')

const router = express.Router();

router.route('/')
    .get(async (req, res) => {
        try {
            const departments = await departmentsBLL.getDepartmentFullData()
            res.json(departments).status(200)
        } catch (err) {
            res.json({ "error": err.message }).status(400)
        }
    })
    .post(async (req, res) => {
        try {
            const { name } = req.body;
            if (!name) {
                res.json({ "error": "must suply the right data" }).status(400)
            }
            const departments = await departmentsBLL.createNewDepartment(req.body)
            res.json(departments).status(200)
        } catch (err) {
            res.json({ "error": err.message }).status(400)
        }
    });

router.route('/editDepartment/:id')
    .get(async (req, res) => { 
        try {
            const { id } = req.params
            const department = await departmentsBLL.getDepartment(id)
            const employeesNotInDepartment = await departmentsBLL.getAllEmployeesNotInDepartment(id)
            res.json({department, employeesNotInDepartment}).status(200)
        } catch (err) {
            res.json({ "error": err.message }).status(400)
        }
    })
    .post(async (req, res) => { 
        try {
            const { id } = req.params
            const {employeeID} = req.body
            const result = await departmentsBLL.addEmployeeToDepartment(id, employeeID)
            res.json(result).status(200)
        } catch (err) {
            res.json({ "error": err.message }).status(400)
        }
    })
    .put(async (req, res) => {
        try {
            const { id } = req.params
            const updatedDepartment = req.body
            const result = await departmentsBLL.updateDepartment(id, updatedDepartment)
            res.json(result).status(200)
        } catch (err) {
            res.json({ "error": err.message }).status(400)
        }
    })
    .delete(async (req, res) => {
        try {
            const { id } = req.params
            const result = await departmentsBLL.removeDepartment(id)
            res.json(result).status(200)
        } catch (err) {
            res.json({ "error": err.message }).status(400)
        }
    });

module.exports = router;