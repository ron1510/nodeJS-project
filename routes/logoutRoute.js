const express = require('express');

const router = express.Router();

router.route('/')
    .post((req, res) => {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.json({"message": "logout post"})
    })

module.exports = router;