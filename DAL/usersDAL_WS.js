const axios = require('axios');

const baseURL = 'https://jsonplaceholder.typicode.com/users'
const getAllUsersFromAPI = async () => {
    return await axios.get(baseURL)
}

const getUserByName = async (name) => { 
    const { data: result } = await axios.get(`${baseURL}?name=${name}`)
    return result[0]
}
const getUserByUsername = async (username) => { 
    const { data: result } = await axios.get(`${baseURL}?username=${username}`)
    return result[0]
}
module.exports = {getAllUsersFromAPI, getUserByName, getUserByUsername}