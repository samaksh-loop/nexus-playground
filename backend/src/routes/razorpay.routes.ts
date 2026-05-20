import { Router } from 'express';
import { simulateRazorpay } from '../controllers/razorpay.controller.js';

const router = Router();

router.post('/razorpay/simulate', simulateRazorpay);

export default router;
