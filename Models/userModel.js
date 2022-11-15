import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        default: '',
        unique: false,
        required: false,
    },
    password: {
        type: String,
        required: true,
    },
    avatar:{
        type: String,
        default: 'https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png'
    },
    cover:{
        type: String,
        default: 'https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png'
    },
    gender: {
        type: String,
         default: '',
    },
    phoneNumber: {
        type: String,
        default: '',
    },
    address: {
        type: String,
        default: '',
    },
    bio: {
        type: String, 
        default: '',
    },
    followers: [{type: mongoose.Types.ObjectId, ref: 'User'}],
    following: [{type: mongoose.Types.ObjectId, ref: 'User'}],
}, {
    timestamps: true
})



const User = mongoose.model('User' , userSchema);

export default User;

