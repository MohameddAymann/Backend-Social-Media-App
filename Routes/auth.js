import express from 'express';
import authController from '../Controllers/authController.js'

const router = express.Router();




// SIGN UP
router.post('/signup' , authController.signup);



// SIGN IN
router.post('/signin', authController.signin );





export default router;