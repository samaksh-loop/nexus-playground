import type { Request, Response } from 'express';
import {
  getSettings, updateSettings,
  getAllSlots, updateSlots
} from '../models/config.model';
import type { Vendor, SlotConfig } from '../types';

export function fetchSettings(_req: Request, res: Response): void {
  res.json({ settings: getSettings()});
}

export function saveSettings(req: Request, res: Response): void {
  const { nexusBaseUrl } = (req.body ?? {}) as { nexusBaseUrl?: unknown };
  if (nexusBaseUrl !== undefined && typeof nexusBaseUrl !== 'string') {
    res.status(400).json({ error: 'nexusBaseUrl must be a string' });
    return;
  }
  const updated = updateSettings(
    nexusBaseUrl === undefined ? {} : { nexusBaseUrl }
  );
  res.json(updated);
}

export function fetchSlots(_req: Request, res: Response): void {
  res.json(getAllSlots());
}

export function saveSlots(req: Request, res: Response): void {
  const vendorParam = req.params.vendor;
  const allSlots = getAllSlots();
  if (typeof vendorParam !== 'string' || !(vendorParam in allSlots)) {
    res.status(400).json({ error: 'invalid vendor' });
    return;
  }
  const vendor = vendorParam as Vendor;
  const body = req.body as SlotConfig[Vendor];
  if (!Array.isArray(body)) {
    res.status(400).json({ error: 'body must be a JSON array' });
    return;
  }
  const updated = updateSlots(vendor, body as never);
  res.json(updated);
}
