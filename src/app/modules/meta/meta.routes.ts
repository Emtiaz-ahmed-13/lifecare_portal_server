import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { MetaController } from "./meta.controller";

const router = express.Router();

router.get(
  "/dashboard-stats",
  auth(UserRole.ADMIN),
  MetaController.getDashboardStats,
);

router.get("/", auth(UserRole.ADMIN), MetaController.getDashboardStats);

export const MetaRoutes = router;
