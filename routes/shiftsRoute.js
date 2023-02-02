const express = require('express');
const shiftsBLL = require('../BLL/shiftsBLL')

const router = express.Router();

router.route('/')
    .get(async (req, res) => {
        try {
            result = await shiftsBLL.getAllShifts()
            res.json(result).status(200)
        } catch (err) {
            res.json({ "error": err.message }).status(400)
        }
    })
    .post(async (req, res) => {
        try {
            const { date, startingHour, endingHour } = req.body
            if (!date || !startingHour || !endingHour) {
                res.json("must suplly all the required information").status(400)
            }
            result = await shiftsBLL.addNewShift(req.body)
            res.json(result).status(200)
        } catch (err) {
            res.json({ "error": err.message }).status(400)
        }
    });


router.route('/editShift/:id')
    .put(async (req, res) => {
        try {
            result = await shiftsBLL.updateShift(req.body)
            res.json(result).status(200)
        } catch (err) {
            res.json({ "error": err.message }).status(400)
        }
    });

router.route('/employees/:id/:employeeID')
    .post(async (req, res) => {
        try {
            const { id, employeeID } = req.params
            const result = await shiftsBLL.allocateShiftToEmployee(id, employeeID)
            res.json(result).status(200)
        } catch (err) {
            res.json({ "error": err.message }).status(400)
        }
    });

module.exports = router;