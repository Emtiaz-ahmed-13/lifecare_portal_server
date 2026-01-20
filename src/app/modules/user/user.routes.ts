import express from 'express';

import { UserController } from './user.controller';

import { UserRole } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { fileUploader } from '../../helper/fileUploader';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';

const router = express.Router();

router.post('/create-patient',
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        next()
    },
    validateRequest(UserValidation.createPatientZodSchema),
    UserController.createPatient)

router.post('/create-admin',
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        next()
    },
    auth(UserRole.ADMIN),
    validateRequest(UserValidation.createAdminZodSchema),
    UserController.createAdmin)

router.post('/create-doctor',
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        next()
    },
    auth(UserRole.ADMIN),
    validateRequest(UserValidation.createDoctorZodSchema),
    UserController.createDoctor)

router.get('/',
    auth(UserRole.ADMIN, UserRole.DOCTOR),
    UserController.getAllFromDb);

export const userRoutes = router;
