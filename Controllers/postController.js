import Post from '../Models/postModel.js';
import Comment from '../Models/commentModel.js';


const postControllerl = {

    createPost: async (req, res) => {
        try {
            const { content } = req.body;
           
            const newPost = new Post({
                content,
                images: req.file ? req.file.filename : null,
                userId: req.user._id
            })
            await newPost.save()

            res.status(201).json({
                message: 'Post has been created.',
                newPost: {
                    ...newPost._doc,
                    user: req.user
                }
            })
        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    },

    getPosts: async (req, res) => {
        try {

            const {page= 1} = req.query;

            const allPosts =  await Post.find({ userId: [...req.user.following, req.user._id] })

            const posts =  await Post.find({ userId: [...req.user.following, req.user._id] })
                .limit(15)
                .skip((page - 1) * 15)
                .sort({
                    createdAt: -1 
                })
                .populate("userId likes", "avatar username firstName lastName").select('-password')
                .populate({
                    path: "comments",
                    populate: {
                        path: "userId",
                        select: "-password"
                    }
                })
                
            res.status(200).json({
                message: 'Success.',
                result: posts.length,
                total: allPosts.length,
                posts
            })

        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    },

    updatePost: async (req, res) => {
        try {
            const { content } = req.body

            const post = await Post.findOneAndUpdate({_id: req.params.id, userId: req.user._id}, {
                content, images: req.file.originalname || null
            }).populate("userId likes", "avatar username firstName lastName")
            .populate({
                path: "comments",
                populate: {
                    path: "userId",
                    select: "-password"
                }
            })
            
            if(!post) return res.status(403).json({message: 'You can not update this post'})

            res.status(200).json({
                message: 'Post has been Updated.',
                newPost: {
                    ...post._doc,
                    content, images
                }
            })
        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    },

    getPost: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id)
            .populate("userId likes", "avatar username firstName lastName")
            .populate({
                path: "comments",
                populate: {
                    path: "userId",
                    select: "-password"
                }
            })

            if(!post) return res.status(404).json({message: 'This post does not exist.'})

            res.status(200).json({
                post
            })

        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    },
    
    deletePost: async (req, res) => {
        try {
            const post = await Post.findOneAndDelete({_id: req.params.id, userId: req.user._id})

            if(!post) return res.status(403).json({message: 'You can not delete this post'})

            await Comment.deleteMany({_id: {$in: post.comments }})

            

            res.status(200).json({
                message: 'Post has been deleted.',
                newPost: {
                    ...post,
                    userId: req.user
                }
            })

        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    },

    getUserPosts: async (req, res) => {
        try {
            const {page = 1} = req.query;
            const posts = await Post.find({userId: req.params.id})
                .limit(15)
                .skip((page - 1) * 15)
                .populate("userId likes", "avatar username firstName lastName")
                .populate({
                    path: "comments",
                    populate: {
                        path: "userId",
                        select: "-password"
                    }
                })
           
            res.status(200).json({
                result: posts.length,
                posts
            })

        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    },

    likePost: async (req, res) => {
        try {
            const post = await Post.find({_id: req.params.id, likes: req.user._id})
            if(post.length > 0) return res.status(400).json({message: 'You already liked this post.'})

            const like = await Post.findOneAndUpdate({_id: req.params.id}, {
                $push: {likes: req.user._id}
            }, {new: true})

            if(!like) return res.status(404).json({message: 'This post does not exist.'})

            res.status(200).json({message: 'Post has been liked.'})

        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    },

    unlikePost: async (req, res) => {
        try {

            const like = await Post.findOneAndUpdate({_id: req.params.id}, {
                $pull: {likes: req.user._id}
            }, {new: true})

            if(!like) return res.status(404).json({message: 'This post does not exist.'})

            res.status(200).json({message: 'Post has been unliked.'})

        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    },

};

export default postControllerl;