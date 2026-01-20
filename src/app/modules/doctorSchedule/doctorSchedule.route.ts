import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { DoctorScheduleController } from "./doctorSchedule.controller";
import { doctorScheduleValidationSchema } from "./doctorSchedule.validation";

const router = express.Router();

router.post(
    "/",
    auth(UserRole.DOCTOR),
    validateRequest(doctorScheduleValidationSchema.doctorScheduleValidation),
    DoctorScheduleController.insertIntoDB
);

router.get(
    "/",

    DoctorScheduleController.getAllFromDB
);

router.get(
    "/doctor",
    auth(UserRole.DOCTOR),
    validateRequest(doctorScheduleValidationSchema.doctorScheduleValidation),
    DoctorScheduleController.schedulesForDoctor
);

router.delete(
    "/:id",
    auth(UserRole.ADMIN),
    validateRequest(doctorScheduleValidationSchema.doctorScheduleValidation),
    DoctorScheduleController.deleteScheduleFromDB
);

export const doctorScheduleRoutes = router;
