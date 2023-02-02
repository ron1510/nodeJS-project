const jwt = require('jsonwebtoken');



const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET,  { expiresIn: '15s' })
}
const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET,  { expiresIn: '1d' })
}

// verify jwt
function verifyAccessToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return { payload: decoded, expired: false };
    } catch (error) {
        return { payload: null, expired: error.message.includes("jwt expired") };
    }
}
function verifyRefreshToken(token) {
    try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    return { payload: decoded, expired: false };
    } catch (error) {
    return { payload: null, expired: error.message.includes("jwt expired") };
    }
}

module.exports = {generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken}