const express = require('express');
const usersBLL = require('../BLL/usersBLL')

const router = express.Router();

// Entry Point 'http://localhost:4000/users'

// Get All Users
router.route('/')
    .get(async (req, res) => {
        try {
            const users = await usersBLL.getAllUsers()
            res.json(users).status(200)
        } catch (err) {
            res.json({ "error": err.message }).status(400)
        }
    })
    .post(async (req, res) => {
        try {
            const allUsersInDB = await usersBLL.getAllUsers()
            if (allUsersInDB.length > 0) {
                res.json("users are loaded already").status(401)
            }
            const users = await usersBLL.loadAllUsers()
            res.json(users).status(200)
        } catch (err) {
            res.json({ "error": err.message }).status(400)
        }
    });

module.exports = router;