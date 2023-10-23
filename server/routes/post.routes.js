import express from 'express';
import postCtrl from '../controllers/post.controller';

const router = express.Router();

router.route('/api/posts')
.get(postCtrl.list)
.post(postCtrl.create);

router.param('postId', postCtrl.postById);

export default router;