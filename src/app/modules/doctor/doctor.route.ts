import express from 'express';
import { DoctorController } from './doctor.controller';

const router = express.Router();

router.post('/suggest', DoctorController.suggestDoctors);
router.get('/suggestion', DoctorController.suggestDoctors);
router.get('/', DoctorController.getAllFromDb);
router.get('/:id', DoctorController.getByIdFromDb);

router.patch('/:id', DoctorController.updateIntoDb);

router.post('/:id/specialties', DoctorController.addDoctorSpecialty);

router.delete('/:id/specialties/:specialtyId', DoctorController.deleteDoctorSpecialty);

export const DoctorRoutes = router;
