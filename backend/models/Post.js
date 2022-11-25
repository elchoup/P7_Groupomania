const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    userId: { type: String, required: true },
    imageUrl: { type: String, required: true},
    description: { type: String, max: 550, required: true},
    postDate:{type: String, required: true},
    likes: { type: Number, required: true},
    usersLiked: { type: [String], required: true}
})

module.exports = mongoose.model('Post', postSchema)