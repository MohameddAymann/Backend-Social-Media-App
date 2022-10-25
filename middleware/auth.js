import jwt from 'jsonwebtoken';
import User from '../Models/userModel.js';


const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization")

        if(!token) return res.status(401).json({message: "No token, authorization denied"})

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        if(!decoded) return res.status(403).json({message: "Invalid Authentication."})

        const user = await User.findOne({_id: decoded.id})
        
        req.user = user
        
        next()

    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}




export default auth;