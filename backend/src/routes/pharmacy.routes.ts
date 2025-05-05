import { Router } from 'express';
import { PharmacyController } from '../controllers/pharmacy.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '../types';

const router = Router();
const pharmacyController = new PharmacyController();

// Create a new pharmacy (only executives and admins)
router.post(
  '/',
  authenticate,
  authorize([UserRole.EXECUTIVE, UserRole.ADMIN]),
  pharmacyController.createPharmacy
);

// Get all pharmacies (only executives and admins)
router.get(
  '/',
  authenticate,
  authorize([UserRole.EXECUTIVE, UserRole.ADMIN]),
  pharmacyController.getAllPharmacies
);

// Get pharmacy by ID (all authenticated users)
router.get(
  '/:id',
  authenticate,
  pharmacyController.getPharmacyById
);

// Update pharmacy (only executives and admins)
router.put(
  '/:id',
  authenticate,
  authorize([UserRole.EXECUTIVE, UserRole.ADMIN]),
  pharmacyController.updatePharmacy
);

// Delete pharmacy (only admins)
router.delete(
  '/:id',
  authenticate,
  authorize([UserRole.ADMIN]),
  pharmacyController.deletePharmacy
);

// Get pharmacies by LGA (only executives and admins)
router.get(
  '/lga/:lga',
  authenticate,
  authorize([UserRole.EXECUTIVE, UserRole.ADMIN]),
  pharmacyController.getPharmaciesByLGA
);

// Get pharmacies by ward (only executives and admins)
router.get(
  '/ward/:ward',
  authenticate,
  authorize([UserRole.EXECUTIVE, UserRole.ADMIN]),
  pharmacyController.getPharmaciesByWard
);

export default router;
