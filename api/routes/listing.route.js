import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import {createlisting,deletelisting,updatelisting,getListing} from '../controllers/listing.controller.js';
const router = express.Router();

router.post('/create', verifyToken ,createlisting);
router.delete('/delete/:id', verifyToken ,deletelisting);
router.post('/update/:id', verifyToken ,updatelisting);
router.get('/get/:id',getListing);
export default router;