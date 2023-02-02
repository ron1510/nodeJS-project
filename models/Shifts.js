const mongoose = require('mongoose');
const { Schema } = mongoose;

const shiftsSchema = new Schema({
    date: Date,
    startingHour: Number,
    endingHour: Number,
});

const Shift = mongoose.model('Shift', shiftsSchema);
module.exports = Shift;