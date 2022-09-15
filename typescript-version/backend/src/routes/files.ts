import express from 'express';
import { filesController }  from '../controllers/files';

const router = express.Router();

router.get('/data', filesController.getData);
router.get('/list', filesController.getList);

export default router;