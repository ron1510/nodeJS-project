const mongoose = require('mongoose')

const url = 'database uri'

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
