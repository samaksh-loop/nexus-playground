import { Router } from 'express';
import { fetchSettings, saveSettings, fetchSlots, saveSlots } from '../controllers/settings.controller.js';

const router = Router();

router.get('/settings',          fetchSettings);
router.put('/settings',          saveSettings);
router.get('/slots',             fetchSlots);
router.put('/slots/:vendor',     saveSlots);

export default router;
