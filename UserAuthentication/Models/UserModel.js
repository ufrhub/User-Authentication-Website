/********************* Import The Mongoose Library *********************/

const Mongoose = require("mongoose");



/********************* Create The Schema *********************/

const UserSchema = new Mongoose.Schema({

    ///**************** Declare The Fields Present In The Collection ****************///

    Name: {
        type: String,
        required: [true, "Please enter your Name...!"]
    },

    Email: {
        type: String,
        required: [true, "Please enter your Email...!"],
        unique: true
    },

    Password: {
        type: String,
        required: [true, "Please enter your Password...!"],
    },

    DateOfBirth: {
        type: Date,
        required: [false, "Please enter your Date of birth...!"]
    },

    isAdmin: {
        type: Boolean,
        default: false
    },

    Avatar: {
        type: String,
        default: "https://res.cloudinary.com/dv6rq6bnx/image/upload/v1638290285/sample.jpg"
    },

    Verified: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});



/********************* Create The Model From Schema And Connect To The MongoDB Collection And Export The Model *********************/

module.exports = Mongoose.model("Users", UserSchema, "users");