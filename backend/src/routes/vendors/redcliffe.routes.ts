import { Router } from 'express';
import {
  checkServiceability,
  getTimeSlots,
  createTemporaryBooking,
  confirmTemporaryBooking,
  updatePaymentMode,
  updateBookingHandler,
} from '../../controllers/vendors/redcliffe.controller.js';

const router = Router();

router.get('/center/v2/is-location-serviceable',         checkServiceability);
router.get('/booking/v2/get-time-slot-list/',            getTimeSlots);
router.post('/external/v2/center-create-booking/',       createTemporaryBooking);
router.post('/external/v2/center-confirm-booking/',      confirmTemporaryBooking);
router.post('/external/v2/center-update-is-credit/',     updatePaymentMode);
router.post('/external/v2/center-update-booking/',       updateBookingHandler);

export default router;
