import express from 'express';
import { fileUploader } from '../helper/fileUploader';
import validateRequest from '../middlewares/validateRequest';
import { UserController } from './user.controller';

import { NextFunction, Request, Response } from 'express';
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

export const userRoutes = router;
