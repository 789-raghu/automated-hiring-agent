import { Response } from "express";
import logger from "../config/logger";
import { Application } from "../models/applications_model";
import { User } from "../models/user_model";
import { Job } from "../models/job_models";
import { parsePagination, buildMeta } from "../utils/pagination";
import { ApplicationStatus } from "../@types/enums";
import type {
  AuthRequest,
  ApplicationByIdParams,
  GetApplicationsQuery,
} from "../@types/request";
import type { ApiResponse, PaginatedResponse } from "../@types/api_response";
import type { IApplication } from "../@types/applications";

export const getAllApplicationById = async (
  req: AuthRequest & { params: ApplicationByIdParams },
  res: Response<ApiResponse<IApplication>>,
) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Application fetched successfully",
      data: application,
    });
  } catch (error) {
    logger.error(`Error fetching application: ${error}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getApplicationsByJobId = async (
  req: AuthRequest & { params: { jobId: string }; query: GetApplicationsQuery },
  res: Response<PaginatedResponse<IApplication>>,
) => {
  try {
    const { jobId } = req.params;
    const { status, page, limit } = req.query;

    const filter: Record<string, any> = { jobId };
    if (status) filter.status = status;

    const pg = parsePagination(page, limit);

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .skip(pg.skip)
        .limit(pg.limit)
        .sort({ appliedOn: -1 }),
      Application.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: "Applications fetched successfully",
      data: applications,
      pagination: buildMeta(total, pg),
    });
  } catch (error) {
    logger.error(`Error fetching applications by job: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: [],
      pagination: { total: 0, page: 1, limit: 10, pages: 0 },
    });
  }
};

export const getApplicationByEmployeeId = async (
  req: AuthRequest & {
    params: { employeeId: string };
    query: GetApplicationsQuery;
  },
  res: Response<PaginatedResponse<IApplication>>,
) => {
  try {
    const { employeeId } = req.params;
    const { status, page, limit } = req.query;

    const filter: Record<string, any> = { userId: employeeId };
    if (status) filter.status = status;

    const pg = parsePagination(page, limit);

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .skip(pg.skip)
        .limit(pg.limit)
        .sort({ appliedOn: -1 }),
      Application.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: "Applications fetched successfully",
      data: applications,
      pagination: buildMeta(total, pg),
    });
  } catch (error) {
    logger.error(`Error fetching applications by employee: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: [],
      pagination: { total: 0, page: 1, limit: 10, pages: 0 },
    });
  }
};

export const updateApplication = async (
  req: AuthRequest & {
    params: ApplicationByIdParams;
    body: Partial<IApplication>;
  },
  res: Response<ApiResponse<IApplication>>,
) => {
  try {
    const { applicationId } = req.params;

    const updated = await Application.findByIdAndUpdate(
      applicationId,
      { $set: req.body },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    logger.info(`Application updated: ${applicationId}`);
    return res.status(200).json({
      success: true,
      message: "Application updated successfully",
      data: updated,
    });
  } catch (error) {
    logger.error(`Error updating application: ${error}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const deleteApplication = async (
  req: AuthRequest & { params: ApplicationByIdParams },
  res: Response<ApiResponse>,
) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findByIdAndDelete(applicationId);

    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    logger.info(`Application deleted: ${applicationId}`);
    return res
      .status(200)
      .json({ success: true, message: "Application deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting application: ${error}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const createApplication = async (
  req: AuthRequest & {
    body: { userId: string; jobId: string; companyId: string };
  },
  res: Response<ApiResponse<IApplication>>,
) => {
  try {
    const { userId, jobId, companyId } = req.body;

    if (!userId || !jobId || !companyId) {
      return res.status(400).json({
        success: false,
        message: "userId, jobId and companyId are required",
      });
    }

    const [user, job] = await Promise.all([
      User.findById(userId),
      Job.findById(jobId),
    ]);

    if (!user || !job) {
      return res
        .status(404)
        .json({ success: false, message: "User or job not found" });
    }

    const application = await Application.create({
      userId,
      jobId,
      companyId,
      status: ApplicationStatus.Applied,
      appliedOn: new Date(),
    });

    logger.info(`Application created: ${application._id}`);
    return res.status(201).json({
      success: true,
      message: "Application created successfully",
      data: application,
    });
  } catch (error) {
    logger.error(`Error creating application: ${error}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
