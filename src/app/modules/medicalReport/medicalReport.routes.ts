import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { MedicalReportController } from "./medicalReport.controller";

const router = express.Router();

router.post("/", auth(UserRole.PATIENT), MedicalReportController.insertIntoDb);

router.get("/", auth(UserRole.PATIENT), MedicalReportController.getFromDb);

export const MedicalReportRoutes = router;
