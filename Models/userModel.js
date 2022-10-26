import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        maxlength: 25
    },
    username: {
        type: String,
        required: true,
        maxlength: 25,
        unique: true
    },
    lastName: {
        type: String,
        required: true,
        maxlength: 25
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
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
         default: 'male'
    },
    phoneNumber: {
        type: String,
         required: true,
          unique: true
    },
    address: {type: String,
         default: ''
    },
    bio: {
        type: String, 
        default: '',
        maxlength: 200
    },
    followers: [{type: mongoose.Types.ObjectId, ref: 'User'}],
    following: [{type: mongoose.Types.ObjectId, ref: 'User'}],
}, {
    timestamps: true
})



const User = mongoose.model('User' , userSchema);

export default User;

