const jwt = require('jsonwebtoken');
const {generateAccessToken, verifyAccessToken, verifyRefreshToken} = require("../utils")

// const verifyJWT = (req, res, next) => {
//     const { accessToken, refreshToken } = req.cookies;
//     //check if the user have accessToken
//     if (!accessToken) {
//         if (!refreshToken) {
//             //game over
//             return res.sendStatus(403)
//         }
//         //try to somthing with refresh token
//         //check the refresh token
//         jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
//             if (err) {
//                 return res.sendStatus(403)
//             }
//             const newAccessToken = generateAccessToken({ exp: Math.floor(Date.now() / 1000) + (60), username: user.username, email: user.email})
//             res.cookie("accessToken", newAccessToken, { httpOnly: true })
//             req.user = user
//             return next()
//         })
//     }
//     else if (!refreshToken) {
//         //game over
//         return res.sendStatus(403)
//     }
//     else {
//         console.log("seee")
//         //try verification of the access token

//         // jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//         //     if (!err) {
//         //         console.log("verification of the access token")
//         //         req.user = user
//         //         console.log(user)
//         //         return next()
//         //     }
//         // })

//         const accessTokenDecoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
//         console.log(accessTokenDecoded)
//         if (accessTokenDecoded) {
//             console.log(accessTokenDecoded)
//             req.user = accessTokenDecoded
//             return next()
//         }
//         console.log('after verification of the access token')
//         // if its expired try verification of refresh token
//         jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
//             if (err) {
//                 return res.sendStatus(403)
//             }
//             const newAccessToken = generateAccessToken({ exp: Math.floor(Date.now() / 1000) + (60), username: user.username, email: user.email})
//             res.cookie("accessToken", newAccessToken, { httpOnly: true })
//             req.user = user
//             return next()
//         })
//         // if expired is game over
//         // if not, create a new access token
//     }
// }

const verifyJWT = (req, res, next) => { 

    const { accessToken, refreshToken } = req.cookies;

    if (!accessToken) {
        return next();
    }

    const { payload, expired } = verifyAccessToken(accessToken);
    // For a valid access token
    if (payload) {
        req.user = payload;
        return next();
    }
    // expired but valid access token


    const refresh = verifyRefreshToken(refreshToken)
    if (!refresh) {
        return next();
    }

    // const newAccessToken = generateAccessToken({exp: Math.floor(Date.now() / 1000) + (60), username: refresh.username, email: refresh.email});
    const newAccessToken = generateAccessToken({ username: refresh.payload.username , email:  refresh.payload.email})
    res.cookie("accessToken", newAccessToken);


    req.user = verifyAccessToken(newAccessToken).payload;
    return next();
}
module.exports = verifyJWT