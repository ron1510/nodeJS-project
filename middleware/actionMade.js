const usersBLL = require('../BLL/usersBLL')
const usersDAL_File = require('../DAL/usersDAL_File')
const User = require('../models/Users')


const actionMade = async (req, res, next) => { 
    // here i need to check if the action was valid
    // in case it was valid i will add it to the tracker file
    // in case it was not valid i will log the user out, if the user will try to log in again it will be 
    // just fine because the second he tries to make an action he will be logged out immediately
    
    const user = req.user
    //check
    
    const usersFullData = await usersBLL.getUserDataByUsername(user.username)

    const userName = usersFullData.name
    const userId = usersFullData.id

    const message = await usersBLL.validateNumOfActions(userId)
    if (message === "invalid") {
        // log the user out
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.json({"message": "cant do more actions"}).status(403)
        return 
    }
    else if (message === "first time") {

        const userDB = await User.findOne({ fullName: userName })
        const newAction = {
            id: userId,
            maxActions: userDB.NumOfAction,
            date: usersBLL.formatDate(new Date()),
            actionsAllowed: userDB.NumOfAction-1
        }
        usersBLL.addNewActionToTracker(newAction)
        next()
        return 
    }

    const lastAction = await usersDAL_File.getLastActionById(userId)
    let newActionsAllowed = lastAction.actionsAllowed - 1
    if (message === "valid update") {
        // update the number of action to the max number
        newActionsAllowed = lastAction.maxActions - 1
    }

    const newAction = {
        id: userId,
        maxActions: lastAction.maxActions,
        date: usersBLL.formatDate(new Date()),
        actionsAllowed: newActionsAllowed
    }

    usersBLL.addNewActionToTracker(newAction)
    next()
    // add the action to the tracker
    // decrease the number of actions
}

module.exports = actionMade