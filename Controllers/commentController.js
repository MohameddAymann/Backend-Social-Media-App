import Post from '../Models/postModel.js';
import Comment from '../Models/commentModel.js';

const commentControllerl = {

    // Create Comment
    createComment: async (req, res) => {
        try {
            const { content } = req.body;
            const { postId } = req.params;

            const post = await Post.findById({_id: postId});

            if(!post) return res.status(404).json({message: 'This post does not exist.'});

            const newComment = new Comment({
                userId: req.user._id,  postUserId: post.userId, postId, content
            });

            await Post.findOneAndUpdate({_id: postId}, {
                $push: {comments: newComment._id}
            }, {new: true});

            await newComment.save();

            res.status(201).json({newComment});

        } catch (error) {
            return res.status(500).json({message: error.message});
        }
    },

    // Update comment
    updateComment: async (req, res) => {
        try {
            const { content } = req.body;
            const {postId, commentId} = req.params;
            
           const comment = await Comment.findOneAndUpdate({
                _id: commentId,
                $or: [
                    {userId: req.user._id},
                    {postUserId: req.user._id}
                ]
            }, {content});

            if(!comment) return res.status(403).json({message: 'You can not update this comment'});

            res.status(200).json({message: 'Comment has been updated'});

        } catch (error) {
            return res.status(500).json({message: error.message});
        }
    },

    // Delete Comment
    deleteComment: async (req, res) => {
        const {commentId, postId} = req.params;
        try {
            const comment = await Comment.findOneAndDelete({
                _id: commentId,
                $or: [
                    {userId: req.user._id},
                    {postUserId: req.user._id}
                ]
            });

            if(!comment) return res.status(403).json({message: 'You can not delete this comment'});

            await Post.findOneAndUpdate({_id: postId}, {
                $pull: {comments: commentId}
            });

            res.status(200).json({message: 'Comment has been deleted' });

        } catch (error) {
            return res.status(500).json({message: error.message});
        }
    },

    // Like Commnet
    likeComment: async (req, res) => {
        const {postId, commentId} = req.params;
        try {
            const comment = await Comment.find({_id: commentId, likes: req.user._id});

            if(comment.length > 0) return res.status(400).json({message: 'You already liked this post.'});

            await Comment.findOneAndUpdate({_id: commentId}, {
                $push: {likes: req.user._id}
            }, {new: true});

            res.json({message: 'Comment has been liked.'});

        } catch (error) {
            return res.status(500).json({message: error.message});
        }
    },

    // Unlike Comment
    unLikeComment: async (req, res) => {
        const {postId, commentId} = req.params;
        try {

            await Comment.findOneAndUpdate({_id: commentId}, {
                $pull: {likes: req.user._id}
            }, {new: true});

            res.json({message: 'Comment has been unliked.'});

        } catch (error) {
            return res.status(500).json({message: error.message});
        }
    },

};

export default commentControllerl;