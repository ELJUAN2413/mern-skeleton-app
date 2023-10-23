import express from 'express';
import likeCtrl from '../controllers/like.controller';

const router = express.Router();

router.route('/api/likes')
.get(likeCtrl.list)
.post(likeCtrl.create);

router.param('likeId', likeCtrl.likeById);

export default router;