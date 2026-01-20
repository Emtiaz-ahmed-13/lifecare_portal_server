import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { DoctorScheduleController } from "./doctorSchedule.controller";

const router = express.Router();

router.post(
    "/",
    auth(UserRole.DOCTOR),
    DoctorScheduleController.insertIntoDB
);

router.get(
    "/",
    DoctorScheduleController.getAllFromDB
);

router.get(
    "/doctor",
    DoctorScheduleController.schedulesForDoctor
);

router.delete(
    "/:id",
    DoctorScheduleController.deleteScheduleFromDB
);

export const doctorScheduleRoutes = router;
