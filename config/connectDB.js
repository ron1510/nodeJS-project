const mongoose = require('mongoose')

const url = 'mongodb+srv://ron1510:rao7o8RON@cluster0.cuf8cts.mongodb.net/nodejsFinalProject?retryWrites=true&w=majority'

const connectDB = () => {
    mongoose.connect(url)
        .then(() => {
            console.log('Connected to the database ')
        })
        .catch((err) => {
            console.error(`Error connecting to the database. n${err}`);
        })
}

module.exports = connectDB