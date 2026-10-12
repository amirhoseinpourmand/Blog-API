const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const postSchema = Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: false,
    },
    creator: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Post', postSchema);