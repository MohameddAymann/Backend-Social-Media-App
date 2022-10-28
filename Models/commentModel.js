import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    likes: [{type: mongoose.Types.ObjectId, ref: 'User'}],
    userId: {type: mongoose.Types.ObjectId, ref: 'User'},
    postId: {type: mongoose.Types.ObjectId, ref: 'Post'},
    postUserId: {type: mongoose.Types.ObjectId, ref: 'User'},
}, {
    timestamps: true
})

const Comment = mongoose.model('Comment', commentSchema)

export default Comment;