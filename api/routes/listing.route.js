import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import {createlisting,deletelisting} from '../controllers/listing.controller.js';
const router = express.Router();

router.post('/create', verifyToken ,createlisting);
router.delete('/delete/:id', verifyToken ,deletelisting);
export default router;