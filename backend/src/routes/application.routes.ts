import express from "express";
import {
  getAllApplicationById,
  getApplicationsByJobId,
  getApplicationByEmployeeId,
  createApplication,
  updateApplication,
  deleteApplication,
} from "../controllers/applications.controller";

const router = express.Router();

router.get("/:applicationId", getAllApplicationById);
router.get("/job/:jobId", getApplicationsByJobId);
router.get("/employee/:employeeId", getApplicationByEmployeeId);
router.post("/", createApplication);
router.put("/", updateApplication);
router.delete("/:applicationId", deleteApplication);

export default router;
