import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { PaymentController } from "./payment.controller";

const router = express.Router();

router.post("/init", auth(UserRole.PATIENT), PaymentController.initPayment);

router.get("/validate", PaymentController.validatePayment);

export const PaymentRoutes = router;
