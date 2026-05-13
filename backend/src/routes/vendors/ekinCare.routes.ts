import { Router } from 'express';
import {
  getAccessToken,
  getProviders,
  getSlotsForProvider,
  createAppointment,
  cancelAppointment,
  rescheduleAppointment,
} from '../../controllers/vendors/ekinCare.controller.js';

const router = Router();

router.get('/get-access-token',                          getAccessToken);
router.get('/providers',                                 getProviders);
router.get('/providers/:providerId/ahc/slots',           getSlotsForProvider);
router.post('/appointments',                             createAppointment);
router.patch('/bookings/:partnerBookingId/cancel',       cancelAppointment);
router.patch('/bookings/:partnerBookingId/reschedule',   rescheduleAppointment);

export default router;
