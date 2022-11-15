import express from 'express';
import commentController from '../Controllers/commentController.js';
import auth from '../middleware/auth.js';
const router = express.Router();


router.post('/:postId/comment/create', auth, commentController.createComment);

router.patch('/:postId/comment/:commentId/update', auth, commentController.updateComment);

router.patch('/:postId/comment/:commentId/like', auth, commentController.likeComment);

router.patch('/:postId/comment/:commentId/unlike', auth, commentController.unLikeComment);

router.delete('/:postId/comment/:commentId/delete', auth, commentController.deleteComment);



export default router;