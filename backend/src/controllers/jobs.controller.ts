import { Response } from "express";
import logger from "../config/logger";
import { Job } from "../models/job_models";
import { parsePagination, buildMeta } from "../utils/pagination";
import type {
  AuthRequest,
  CreateJobBody,
  UpdateJobBody,
  JobByIdParams,
  GetAllJobsQuery,
} from "../@types/request";
import type { ApiResponse, PaginatedResponse } from "../@types/api_response";
import type { IJob } from "../@types/jobs";

export const createJob = async (
  req: AuthRequest & { body: CreateJobBody },
  res: Response<ApiResponse<IJob>>,
) => {
  try {
    const {
      companyId,
      title,
      description,
      skillsRequired,
      experienceLevel,
      salary,
      location,
      type,
    } = req.body;

    if (!companyId || !title || !description || !experienceLevel || !type) {
      return res.status(400).json({
        success: false,
        message:
          "companyId, title, description, experienceLevel and type are required",
      });
    }

    const job = new Job({
      companyId,
      title,
      description,
      skillsRequired,
      experienceLevel,
      salary,
      location,
      type,
    });
    await job.save();

    logger.info(`Job created: ${job._id}`);
    return res
      .status(201)
      .json({ success: true, message: "Job created successfully", data: job });
  } catch (error) {
    logger.error(`Error creating job: ${error}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const updateJob = async (
  req: AuthRequest & { params: JobByIdParams; body: UpdateJobBody },
  res: Response<ApiResponse<IJob>>,
) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findByIdAndUpdate(
      jobId,
      { $set: req.body },
      { new: true, runValidators: true },
    );

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    logger.info(`Job updated: ${jobId}`);
    return res
      .status(200)
      .json({ success: true, message: "Job updated successfully", data: job });
  } catch (error) {
    logger.error(`Error updating job: ${error}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const deleteJob = async (
  req: AuthRequest & { params: JobByIdParams },
  res: Response<ApiResponse>,
) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findByIdAndDelete(jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    logger.info(`Job deleted: ${jobId}`);
    return res
      .status(200)
      .json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting job: ${error}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getJobById = async (
  req: AuthRequest & { params: JobByIdParams },
  res: Response<ApiResponse<IJob>>,
) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Job fetched successfully", data: job });
  } catch (error) {
    logger.error(`Error fetching job: ${error}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getAllJobs = async (
  req: AuthRequest & { query: GetAllJobsQuery },
  res: Response<PaginatedResponse<IJob>>,
) => {
  try {
    const { companyId, experienceLevel, type, location, page, limit } =
      req.query;

    const filter: Record<string, any> = {};
    if (companyId) filter.companyId = companyId;
    if (experienceLevel) filter.experienceLevel = experienceLevel;
    if (type) filter.type = type;
    if (location) filter.location = { $regex: location, $options: "i" };

    const pg = parsePagination(page, limit);

    const [jobs, total] = await Promise.all([
      Job.find(filter).skip(pg.skip).limit(pg.limit).sort({ createdAt: -1 }),
      Job.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      data: jobs,
      pagination: buildMeta(total, pg),
    });
  } catch (error) {
    logger.error(`Error fetching jobs: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: [],
      pagination: { total: 0, page: 1, limit: 10, pages: 0 },
    });
  }
};
