const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    firstname: {
        type: String,
        required: true,
    },

    lastname: {
        type: String,
        required: true,
    },

    isAdmin: {
        type: Boolean,
        default: false
    },

    profilePicture: {
        type: String,
    },
    coverPicture: String,
    about: String,
    livesin: String,
    workAt: String,
    relationship: String,
    country: String,
    followers: [],
    following: []
},
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('User', userSchema);