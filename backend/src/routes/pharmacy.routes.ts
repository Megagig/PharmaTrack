import { Router } from 'express';
import { PharmacyController } from '../controllers/pharmacy.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '../types';

const router = Router();
const pharmacyController = new PharmacyController();

// Bind controller methods to ensure correct 'this' context
const createPharmacy =
  pharmacyController.createPharmacy.bind(pharmacyController);
const getAllPharmacies =
  pharmacyController.getAllPharmacies.bind(pharmacyController);
const getPharmacyById =
  pharmacyController.getPharmacyById.bind(pharmacyController);
const updatePharmacy =
  pharmacyController.updatePharmacy.bind(pharmacyController);
const deletePharmacy =
  pharmacyController.deletePharmacy.bind(pharmacyController);
const getPharmaciesByLGA =
  pharmacyController.getPharmaciesByLGA.bind(pharmacyController);
const getPharmaciesByWard =
  pharmacyController.getPharmaciesByWard.bind(pharmacyController);

// Create a new pharmacy (only executives and admins)
router.post(
  '/',
  authenticate,
  authorize([UserRole.EXECUTIVE, UserRole.ADMIN]),
  createPharmacy
);

// Get all pharmacies (only executives and admins)
router.get(
  '/',
  authenticate,
  authorize([UserRole.EXECUTIVE, UserRole.ADMIN]),
  getAllPharmacies
);

// Get pharmacy by ID (all authenticated users)
router.get('/:id', authenticate, getPharmacyById);

// Update pharmacy (only executives and admins)
router.put(
  '/:id',
  authenticate,
  authorize([UserRole.EXECUTIVE, UserRole.ADMIN]),
  updatePharmacy
);

// Delete pharmacy (only admins)
router.delete(
  '/:id',
  authenticate,
  authorize([UserRole.ADMIN]),
  deletePharmacy
);

// Get pharmacies by LGA (only executives and admins)
router.get(
  '/lga/:lga',
  authenticate,
  authorize([UserRole.EXECUTIVE, UserRole.ADMIN]),
  getPharmaciesByLGA
);

// Get pharmacies by ward (only executives and admins)
router.get(
  '/ward/:ward',
  authenticate,
  authorize([UserRole.EXECUTIVE, UserRole.ADMIN]),
  getPharmaciesByWard
);

export default router;
