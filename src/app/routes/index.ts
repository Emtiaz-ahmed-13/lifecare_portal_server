import express from 'express';
import { authRoutes } from '../modules/Auth/auth.routes';

import { DoctorScheduleRoutes } from '../modules/schedule/schedule.route';

import { DoctorRoutes } from '../modules/doctor/doctor.route';
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
        path: '/specialties',
        route: SpecialtiesRoutes
    },
    {
        path: '/doctor',
        route: DoctorRoutes
    },


];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;