import { UserRole } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import { fileUploader } from "../../helper/fileUploader";
import auth from "../../middlewares/auth";
import { SpecialtiesController } from "./specialties.controller";
import { SpecialtiesValidation } from "./specialties.validation";

const router = express.Router();

router.get("/", SpecialtiesController.getAllFromDB);

router.post(
  "/",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = SpecialtiesValidation.create.parse(JSON.parse(req.body.data));
    return SpecialtiesController.insertIntoDB(req, res, next);
  },
);

router.delete("/:id", auth(UserRole.ADMIN), SpecialtiesController.deleteFromDB);

export const SpecialtiesRoutes = router;
