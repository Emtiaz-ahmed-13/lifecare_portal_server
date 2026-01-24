import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { ReviewController } from "./review.controller";

const router = express.Router();

router.post("/", auth(UserRole.PATIENT), ReviewController.insertIntoDb);

router.get("/", ReviewController.getAllFromDb);

export const ReviewRoutes = router;
