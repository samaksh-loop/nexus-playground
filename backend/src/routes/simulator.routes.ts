import { Router } from 'express';
import {
  listBookings,
  removeBooking,
  getLifecycles,
  simulateWebhook,
  simulateLifecycle,
} from '../controllers/simulator.controller.js';

const router = Router();

router.get('/bookings',            listBookings);
router.delete('/bookings/:id',     removeBooking);
router.get('/lifecycles',          getLifecycles);
router.post('/simulate/webhook',   simulateWebhook);
router.post('/simulate/lifecycle', simulateLifecycle);

export default router;
