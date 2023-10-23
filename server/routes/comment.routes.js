import express from "express";
import commentCtrl from '../controllers/comment.controller';

const router = express.Router();

router.route('/api/comments')
.get(commentCtrl.list)
.post(commentCtrl.create);

router.param('commentId', commentCtrl.commentById);

export default router;
