import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    content: String,
    images: {
        type: String,
    },
    likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
    userId: {type: mongoose.Types.ObjectId, ref: 'User'}
}, {
    timestamps: true
})

const Post =  mongoose.model('Post', postSchema);

export default Post;