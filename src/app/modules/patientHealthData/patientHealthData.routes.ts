import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import { PatientHealthDataController } from './patientHealthData.controller';

const router = express.Router();

router.post(
    '/',
    auth(UserRole.PATIENT),
    PatientHealthDataController.insertIntoDb
);

router.get(
    '/',
    auth(UserRole.PATIENT),
    PatientHealthDataController.getFromDb
);

export const PatientHealthDataRoutes = router;
