const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const userSchema = new Schema({

    name: {
        type: String,
        required: true,
        unique: true,
        minlenght: 4,
        maxlength: 15,
    },
    email: {
        type: String,
        required: true,
        minlenght: 4,
        maxlength: 30,
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'new user',
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: "Post",
    }]
});

module.exports = mongoose.model('User', userSchema);