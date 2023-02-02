const axios = require('axios');
const {generateAccessToken, generateRefreshToken} = require("../utils")

const baseURL = 'https://jsonplaceholder.typicode.com/users';

const login = async (username, email) => { 
    // need to verify the username and email with the jsonplaceholder api and not with the DB
    const { data: foundUser } = await axios.get(`${baseURL}?username=${username}&email=${email}`)
    if (!foundUser.length) {
        return { message: "username or email are incorrect", status: 401 }
    }
    // user is authenticated with the jsonplaceholder and now we need to create a new access token and refresh token
    
    //create the jwt tokens
    
    const accessToken = generateAccessToken({ username, email })
    const refreshToken = generateRefreshToken({ username, email})

    // after the creation i will not send those tokens to the client because i will save them inside an httpOnly cookie

    return { message: "user logged in!", status: 200, value: {accessToken, refreshToken} }
}

module.exports = {login}