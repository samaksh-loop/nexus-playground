import 'dotenv/config';
import cors from 'cors';
import express from 'express';

import { loadConfig } from './models/config.model.js';
import { loadBookingStore } from './models/booking.model.js';

import orangeHealthRoutes from './routes/vendors/orangeHealth.routes.js';
import healthiansRoutes from './routes/vendors/healthians.routes.js';
import redcliffeRoutes from './routes/vendors/redcliffe.routes.js';
import ekinCareRoutes from './routes/vendors/ekinCare.routes.js';

import simulatorRoutes from './routes/simulator.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import razorpayRoutes from './routes/razorpay.routes.js';

import { VendorPrefix } from './constants.js';

loadConfig();
loadBookingStore();

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json({ limit: '2mb' }));

// Set nexus-staging env vars to these base URLs:
//   ORANGE_HEALTH_BASE_URL      → http://localhost:3001/oh
//   SERVER_HEALTHIANS_BASE_URL  → http://localhost:3001/healthians
//   SERVER_REDCLIFFE_BASE_URL   → http://localhost:3001/redcliffe
//   EKIN_CARE_BASE_URL          → http://localhost:3001/ekin-care
app.use(`/${VendorPrefix.ORANGE_HEALTH}`, orangeHealthRoutes);
app.use(`/${VendorPrefix.HEALTHIANS}`,    healthiansRoutes);
app.use(`/${VendorPrefix.REDCLIFFE}`,     redcliffeRoutes);
app.use(`/${VendorPrefix.EKIN_CARE}`,     ekinCareRoutes);

app.use('/api', simulatorRoutes);
app.use('/api', settingsRoutes);
app.use('/api', razorpayRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'nexus-playground-backend' });
});

app.listen(PORT, () => {
  console.log(`\nnexus-playground  →  http://localhost:${PORT}`);
  console.log('mock vendor prefixes:');
  Object.values(VendorPrefix).forEach((p) => console.log(`  /${p}/*`));
  console.log();
});
