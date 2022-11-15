import express from 'express';
import postController from '../Controllers/postController.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/multer.js';


const router = express.Router(); 



router.post('/create', auth, upload,  postController.createPost);

router.get('/', auth, postController.getPosts);

router.patch('/update/:id', auth, postController.updatePost); 

router.get('/:id', auth, postController.getPost);

router.delete('/delete/:id', auth, postController.deletePost);

router.get('/user_posts/:id', auth, postController.getUserPosts);

router.patch('/:id/like', auth, postController.likePost);

router.patch('/:id/unlike', auth, postController.unlikePost); 







export default router;