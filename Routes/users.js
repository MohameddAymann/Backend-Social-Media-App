import express from 'express';
import userController from '../Controllers/userController.js';
import auth from '../middleware/auth.js';
const router = express.Router();

router.get('/search', auth, userController.searchUser);

router.get('/:id', auth, userController.getUser);

router.patch('/update', auth, userController.updateUser);

router.patch('/update/password', auth, userController.resetPassword);

router.patch('/:id/follow', auth, userController.follow);

router.patch('/:id/unfollow', auth, userController.unfollow);





export default router;