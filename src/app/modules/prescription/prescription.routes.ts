import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import { PrescriptionController } from './prescription.controller';

const router = express.Router();

router.post(
    '/',
    auth(UserRole.DOCTOR),
    PrescriptionController.createPrescription
);

router.get(
    '/my-prescriptions',
    auth(UserRole.PATIENT),
    PrescriptionController.getMyPrescriptions
);

export const PrescriptionRoutes = router;
