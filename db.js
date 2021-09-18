const mongoose = require('mongoose');

// const mongooseURI = 'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false';
const mongooseURI = 'mongodb+srv://Chetan:Chetan_03@cluster0.ktumx.mongodb.net/inotebook?retryWrites=true&w=majority'
const connectToMongo = () => {
    mongoose.connect(mongooseURI, () => {
        console.log("Connected to Mongoose");
    })
}

module.exports = connectToMongo;