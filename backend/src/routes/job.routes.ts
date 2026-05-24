import express, { Response } from "express";
import {
  createJob,
  updateJob,
  deleteJob,
  getJobById,
  getAllJobs,
} from "../controllers/jobs.controller";
import authMiddleWare from "../middleware/auth_middleware";
import type {
  AuthRequest,
  CreateJobBody,
  UpdateJobBody,
  JobByIdParams,
  GetAllJobsQuery,
} from "../@types/request";

const router = express.Router();

router.get(
  "/",
  authMiddleWare,
  (req: AuthRequest & { query: GetAllJobsQuery }, res: Response) =>
    getAllJobs(req, res),
);

router.get(
  "/:jobId",
  authMiddleWare,
  (req: AuthRequest & { params: JobByIdParams }, res: Response) =>
    getJobById(req, res),
);

router.post(
  "/",
  authMiddleWare,
  (req: AuthRequest & { body: CreateJobBody }, res: Response) =>
    createJob(req, res),
);

router.put(
  "/:jobId",
  authMiddleWare,
  (
    req: AuthRequest & { params: JobByIdParams; body: UpdateJobBody },
    res: Response,
  ) => updateJob(req, res),
);

router.delete(
  "/:jobId",
  authMiddleWare,
  (req: AuthRequest & { params: JobByIdParams }, res: Response) =>
    deleteJob(req, res),
);

export default router;
