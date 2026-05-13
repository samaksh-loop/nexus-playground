import { Router } from 'express';
import { getServiceability, createOrder, cancelOrder, rescheduleOrder } from '../../controllers/vendors/orangeHealth.controller.js';

const router = Router();

router.get('/serviceability',              getServiceability);
router.post('/order',                      createOrder);
router.patch('/:partnerBookingId/cancel',  cancelOrder);
router.patch('/:partnerBookingId/reschedule', rescheduleOrder);

export default router;
