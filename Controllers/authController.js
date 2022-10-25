import User from '../Models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const authController = {
    // SIGN UP
    signup: async (req,res) => {
        try {
            const { firstName, username, lastName, email, password, gender, phoneNumber } = req.body;

            //Check if username already exist or not
            const checkUsername = await User.findOne({username});
            if(checkUsername) return res.status(400).json({message: "This username already exists."});

            //Check if phone number already exist or not
            const checkPhoneNumber = await User.findOne({phoneNumber});
            if(checkPhoneNumber) return res.status(400).json({message: "This phone number already exists."});

            //Check if phone number already exist or not
            const checkEmail = await User.findOne({email});
            if(checkEmail) return res.status(400).json({message: "This email already exists."});

            //Check if password length more that 6 or not
            if(password.length < 6)
            return res.status(400).json({message: "Password must be at least 6 characters."});

            //Generate hash password
            const hashPassword = await bcrypt.hash(password, 12);

            const newUser = new User({
                firstName,
                lastName,
                email,
                password: hashPassword, 
                gender,
                phoneNumber,
                username
            });

            await newUser.save();
      
            res.status(201).json({
                message: 'Register Success!',
                access_token: generateAccessToken(newUser._id),
                user: {
                    ...newUser._doc,
                    password: ''
                }
            });


        } catch (error) {
            return res.status(500).json({message: error.message});
        };
    },
    
    //SIGN IN
    signin: async (req, res) => {
        try {
            const { username, password } = req.body;
            // Find The User
            const user = await User.findOne({username})
            .populate("followers following", "avatar firstName lastName username followers following");

            // If the user not exist 
            if(!user) return res.status(404).json({message: "Username or Password is incorrect."});

            // Compare the password
            const isTheSame = await bcrypt.compare(password, user.password);

            // If the password false
            if(!isTheSame) return res.status(403).json({message: "Username or Password is incorrect."});


            res.status(200).json({
                message: 'Login Success!',
                access_token: generateAccessToken(user._id),
                user: {
                    ...user._doc,
                    password: ''
                }
            });

        } catch (error) {
            return res.status(500).json({message: error.message});
        };
    },

   
    
    
};


const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    })
}



export default authController;