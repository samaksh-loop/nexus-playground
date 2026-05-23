import { Router } from 'express';
import { simulateRazorpay, simulateRazorpayRefund } from '../controllers/razorpay.controller.js';

const router = Router();

router.post('/razorpay/simulate', simulateRazorpay);
router.post('/razorpay/simulate-refund', simulateRazorpayRefund);

export default router;
