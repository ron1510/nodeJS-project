const User = require("../models/Users");
const {getAllUsersFromAPI, getUserByName, getUserByUsername} = require('../DAL/usersDAL_WS')
const {setUsers, getUsers, getLastActionById} = require('../DAL/usersDAL_File')

const getAllUsers = async () => {
    return await User.find({}).exec();
}


// for dev only
const loadAllUsers = async () => {
    const {data: users} = await getAllUsersFromAPI()
    const usersForDB = users.map(user => {
        const rnd = Math.floor((Math.random() * 10) + 1);
        return {
            fullName: user.name,
            NumOfAction: rnd
        }
    })
    for (let i = 0; i < usersForDB.length; i++) { 
        const user = new User(usersForDB[i])
        await user.save()
    }
}

const validateNumOfActions = async (id) => { 
    const lastAction = await getLastActionById(id)
    if (lastAction) {
        const currentDate = new Date();
        const formatedDate = formatDate(currentDate)
        if (getDifferenceInDays(formatedDate, lastAction.date) >= 1) {
            return "valid update"
        }
        if (lastAction.actionsAllowed <= 0) {
            return "invalid"
        }
        return "valid"
    }
    return "first time"
}

const getDifferenceInDays = (dateStr1, dateStr2) => {
    const date1 = dateStr1.split('/')
    const date2 = dateStr2.split('/')

    const day1 = date1[0]
    const day2 = date2[0]
    const month1 = date1[1]
    const month2 = date2[1]
    const year1 = date1[2]
    const year2 = date2[2]

    const diff = (Number(day1) - Number(day2)) + (30 * Number(month1) - Number(month2)) + (365 * Number(year1) - Number(year2))
    return diff
}

const addNewActionToTracker = async (obj) => {
    const data = await getUsers()
    data.actions.push(obj)
    const result = await setUsers(data)
    return result
}

const formatDate = (date) => {
    let day = date.getDate();

    let month = date.getMonth();

    let year = date.getFullYear();

    let format = day + "/" + (month+1) + "/" + year;
    return format
}

const getUserDataByUsername = async (username) => {
    return await getUserByUsername(username)
}

module.exports = {getAllUsers, loadAllUsers, validateNumOfActions, addNewActionToTracker, getUserDataByUsername, formatDate}