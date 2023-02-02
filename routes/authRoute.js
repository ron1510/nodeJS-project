const express = require('express');
const authBLL = require('../BLL/authBLL')

const router = express.Router();

router.route('/')
    .post(async (req, res) => {
        const { username, email } = req.body
        if (!username || !email) { 
            res.json({ "message": "must suply username and email" }).status(403)
        }
        // trying to log the user in
        const response = await authBLL.login(username, email)
        // check if the verification was successful
        if (response.status === 200) {
            res.cookie("accessToken", response.value.accessToken, {httpOnly: true})
            res.cookie("refreshToken", response.value.refreshToken, {httpOnly: true})
        }

        // if it was successful then create a the user an access token and a refresh token
        // and store both at http cookies
        // if its not just do nothing
        res.json({ "message": `${response.message}` }).status(response.status)
    });

module.exports = router;