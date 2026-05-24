import express, { Response } from "express";
import {
  GetAssessmentById,
  GenerateAssessment,
  AssessmentPreview,
  submitAssessment,
} from "../controllers/asessment.controller";
import authMiddleWare from "../middleware/auth_middleware";
import type { AuthRequest } from "../@types/request";
import type {
  GenerateAssessmentBody,
  SubmitAssessmentBody,
  AssessmentByIdParams,
} from "../@types/request";

const router = express.Router();

router.post(
  "/generate",
  authMiddleWare,
  (req: AuthRequest & { body: GenerateAssessmentBody }, res: Response) =>
    GenerateAssessment(req, res),
);

router.get(
  "/:assessmentId",
  authMiddleWare,
  (req: AuthRequest & { params: AssessmentByIdParams }, res: Response) =>
    GetAssessmentById(req, res),
);

router.get(
  "/:assessmentId/preview",
  authMiddleWare,
  (req: AuthRequest & { params: AssessmentByIdParams }, res: Response) =>
    AssessmentPreview(req, res),
);

router.post(
  "/submit",
  authMiddleWare,
  (req: AuthRequest & { body: SubmitAssessmentBody }, res: Response) =>
    submitAssessment(req, res),
);

export default router;
