import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import { AppointmentController } from './appointment.controller';

const router = express.Router();

router.post(
    '/',
    auth(UserRole.PATIENT),
    AppointmentController.bookAppointment
);

router.get(
    '/my-appointments',
    auth(UserRole.PATIENT, UserRole.DOCTOR),
    AppointmentController.getMyAppointments
);

export const AppointmentRoutes = router;
