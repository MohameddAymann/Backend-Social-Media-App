import User from '../Models/userModel.js';
import bcrypt from 'bcrypt';

const userController = {

    // SEARCH
    searchUser: async (req, res) => {
        try {
            const users = await User.find({username: {$regex: req.query.username}})
            .limit(10).select("firstName lastName username avatar")

            res.status(200).json({users})
        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    },

    // GET ONE USER
    getUser: async (req, res) => { 
        try {
            const user = await User.findById(req.params.id).select('-password')
            .populate("followers following", "-password")
            if(!user) return res.status(400).json({message: "User does not exist."})
            
            res.status(200).json({user})
        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    },

    // UPDATE MY ACCOUNT
    updateUser: async (req, res) => {
        try {
            const { avatar, cover, firstName, lastName, phoneNumber, address, email, username, bio, gender } = req.body
            if(!firstName && !lastName && !phoneNumber && !username && !email) return res.status(400).json({message: "Please complete your data."})


            await User.findOneAndUpdate({_id: req.user._id}, {
                avatar, firstName, phoneNumber, address, bio, gender, lastName, email, username, cover
            })


            res.status(200).json({message: "Update Success!"})

        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    },

    // RESET PASSWORD
    resetPassword: async (req, res) => {
        try {

            const {oldPassword, newPassword} = req.body;

            //Check if password length more that 6 or not
            if(newPassword.length < 6)
            return res.status(400).json({message: "Password must be at least 6 characters."});

            const user = await User.findById({_id: req.user._id});

            const isTheSame = await bcrypt.compare(oldPassword, user.password);

            // If the password false
            if(!isTheSame) return res.status(403).json({message: "Password is incorrect."});

            //Generate hash password
            const hashPassword = await bcrypt.hash(newPassword, 12);

            await user.updateOne({password: hashPassword});

            await user.save();

            res.status(200).json({message: "Password id changed"})


          
        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    },

    // FOLLOW
    follow: async (req, res) => {
        try {
            const user = await User.find({_id: req.params.id, followers: req.user._id})
            if(user.length > 0) return res.status(500).json({message: "You followed this user."})

            const newUser = await User.findOneAndUpdate({_id: req.params.id}, { 
                $push: {followers: req.user._id}
            }, {new: true}).populate("followers following", "-password")

            await User.findOneAndUpdate({_id: req.user._id}, {
                $push: {following: req.params.id}
            }, {new: true})

            res.status(200).json({newUser})

        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    },

    // UNFOLLOW
    unfollow: async (req, res) => {
        try {

            const newUser = await User.findOneAndUpdate({_id: req.params.id}, { 
                $pull: {followers: req.user._id}
            }, {new: true}).populate("followers following", "-password")

            await User.findOneAndUpdate({_id: req.user._id}, {
                $pull: {following: req.params.id}
            }, {new: true})

            res.status(200).json({newUser})

        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    },

}

export default userController;