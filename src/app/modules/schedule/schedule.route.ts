import express from "express";
import { ScheduleController } from "./schedule.controller";

const router = express.Router();

router.post(
    "/",
    ScheduleController.insertIntoDB
);

router.get(
    "/",
    ScheduleController.getAllFromDB
);
router.get(
    "/doctor",
    ScheduleController.schedulesForDoctor
);
router.delete(
    "/:id",
    ScheduleController.deleteScheduleFromDB
);


export const scheduleRoutes = router;
