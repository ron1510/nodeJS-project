require('dotenv').config()

const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/connectDB');
const mongoose = require('mongoose');
const verifyJWT = require('./middleware/verifyJWT');
const actionMade = require('./middleware/actionMade');
const requiredUser = require('./middleware/requiredUser');

const departmentsRoute = require('./routes/departmentsRoute')
const authRoute = require('./routes/authRoute')
const usersRoute = require('./routes/usersRoute')
const employeesRoute = require('./routes/employeesRoute')
const shiftsRoute = require('./routes/shiftsRoute')
const logoutRoute = require('./routes/logoutRoute');


const PORT = 4000
const app = express()

mongoose.set('strictQuery', false);
connectDB()

// app.use(cors(corsOptions))
app.use(cors());

app.use(express.urlencoded({ extended: false }));

app.use(express.json())

app.use(cookieParser())

//unprotected Routes

app.use('/auth', authRoute)

// later here we will add the condition for the protected routes
app.use(verifyJWT)
app.use(requiredUser)
//protected routes

// num of actions middleware
// this middleware was created to decrease the numOfAction property of every user
app.use(actionMade)

app.use('/departments', departmentsRoute)
app.use('/logout', logoutRoute)
app.use('/users', usersRoute)
app.use('/shifts', shiftsRoute)
app.use('/employees', employeesRoute)

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
})  