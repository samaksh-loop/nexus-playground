import { Router } from 'express';
import {
  getAccessToken,
  checkServiceability,
  getSlotsByZipCode,
  freezeSlot,
  createBookingHandler,
  cancelBookingHandler,
  rescheduleBookingHandler,
} from '../../controllers/vendors/healthians.controller.js';

const router = Router();

router.get('/getAccessToken',                 getAccessToken);
router.post('/checkServiceabilityByLocation', checkServiceability);
router.post('/getSlotsByZipCode_v1',          getSlotsByZipCode);
router.post('/freezeSlot_v1',                 freezeSlot);
router.post('/createBooking_v1',              createBookingHandler);
router.post('/cancelBooking',                 cancelBookingHandler);
router.post('/rescheduleBookingByCustomer_v1',rescheduleBookingHandler);

export default router;
