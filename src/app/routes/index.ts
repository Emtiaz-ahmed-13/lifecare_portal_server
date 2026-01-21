import express from 'express';
import { authRoutes } from '../modules/Auth/auth.routes';
import { AppointmentRoutes } from '../modules/appointment/appointment.routes';
import { MedicalReportRoutes } from '../modules/medicalReport/medicalReport.routes';

import { PatientHealthDataRoutes } from '../modules/patientHealthData/patientHealthData.routes';
import { PaymentRoutes } from '../modules/payment/payment.routes';
import { PrescriptionRoutes } from '../modules/prescription/prescription.routes';
import { ReviewRoutes } from '../modules/review/review.routes';

import { DoctorScheduleRoutes } from '../modules/schedule/schedule.route';

import { DoctorRoutes } from '../modules/doctor/doctor.route';
import { doctorScheduleRoutes } from '../modules/doctorSchedule/doctorSchedule.route';
import { MetaRoutes } from '../modules/meta/meta.routes';
import { SpecialtiesRoutes } from '../modules/specialties/specialties.route';
import { userRoutes } from '../modules/user/user.routes';


const router = express.Router();

const moduleRoutes = [

    {
        path: '/user',
        route: userRoutes
    },
    {
        path: '/auth',
        route: authRoutes
    },
    {
        path: '/schedule',
        route: DoctorScheduleRoutes
    },
    {
        path: '/doctor-schedule',
        route: doctorScheduleRoutes
    },
    {
        path: '/specialties',
        route: SpecialtiesRoutes
    },
    {
        path: '/doctor',
        route: DoctorRoutes
    },
    {
        path: '/appointment',
        route: AppointmentRoutes
    },
    {
        path: '/prescription',
        route: PrescriptionRoutes
    },
    {
        path: '/payment',
        route: PaymentRoutes
    },
    {
        path: '/reviews',
        route: ReviewRoutes
    },
    {
        path: '/patient-health-data',
        route: PatientHealthDataRoutes
    },
    {
        path: '/medical-reports',
        route: MedicalReportRoutes
    },


    {
        path: '/meta',
        route: MetaRoutes
    },
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;