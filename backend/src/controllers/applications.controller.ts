import { Request, Response } from "express";
import logger from "../config/logger";
import { Application } from "../models/applications_model";
import { User } from "../models/user_model";
import { Job } from "../models/job_models";

export const getAllApplicationById = async (req: Request, res: Response) => {
  try {
    const applicationId = req.params.applicationId;

    if (applicationId == undefined) {
      logger.error(`the application id is undefined`);
      return res.status(400).json({
        success: false,
        message: "ApplicationId is required",
      });
    }

    const applications = await Application.find({ _id: applicationId });

    logger.info(`applications fetched successfully ${applications}`);
    return res.status(200).json({
      success: true,
      message: "Applications fetched successfully",
      data: applications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

export const getApplicationsByJobId = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.jobId;

    if (jobId == undefined) {
      return res.status(400).json({
        success: false,
        message: "Job Id is required",
      });
    }

    const applications = await Application.find({ jobId });

    logger.info(`applications fetched successfully ${applications}`);
    return res.status(200).json({
      success: true,
      message: "Applications fetched successfully",
      data: applications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

export const getApplicationByEmployeeId = async (
  req: Request,
  res: Response,
) => {
  try {
    const employeeId = req.params.employeeId;

    if (employeeId == undefined) {
      logger.error(`the employee id is undefined`);
      return res.status(400).json({
        success: false,
        message: "EmployeeId is required",
      });
    }

    const applications = await Application.find({ employeeId });

    return res.status(200).json({
      success: true,
      message: "Applications fetched successfully",
      data: applications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

export const updateApplication = async (req: Request, res: Response) => {
  try {
    const { applicationId, ...data } = req.body;

    if (applicationId == undefined) {
      logger.error("the application id is undefined");
      return res.status(400).json({
        success: false,
        message: "ApplicationId is required",
      });
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      applicationId,
      data,
      {
        new: true,
        runValidators: true,
      },
    );

    logger.info(`application updated successfully ${updatedApplication}`);
    return res.status(200).json({
      success: true,
      message: "Application updated successfully",
      data: updatedApplication,
    });
  } catch (error) {
    logger.error(`error updating application ${error}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

export const deleteApplication = async (req: Request, res: Response) => {
  try {
    const applicationId = req.params.applicationId;

    if (applicationId == undefined) {
      logger.error(`the application id is undefined`);
      return res.status(400).json({
        success: false,
        message: "ApplicationId is required",
      });
    }

    const application = await Application.deleteOne({ _id: applicationId });

    if (application.deletedCount == 0) {
      logger.error(`application not found for the given id : ${applicationId}`);
      return res.status(404).json({
        success: false,
        message: "No application with given Id",
      });
    }
    logger.info("Application deleted successfully");
    return res.status(200).json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

export const createApplication = async (req: Request, res: Response) => {
  try {
    const { userId, jobId, ...data } = req.body;

    if (userId == undefined || jobId == undefined) {
      logger.error("the userId and jobId are undefined");
      return res.status(400).json({
        success: false,
        message: "UserId and JobId are required",
      });
    }

    const user = User.findOne({ _id: userId });
    const job = Job.findOne({ _id: jobId });

    if (!job || !user) {
      logger.error("the job or user is undefined");
      return res.status(400).json({
        success: false,
        message: "Job or User is required",
      });
    }

    const application = await Application.create({
      userId,
      jobId,
      ...data,
    });

    logger.info(`application created successfully ${application}`);
    return res.status(200).json({
      success: true,
      message: "Application created successfully",
      data: application,
    });
  } catch (error) {
    logger.error(`error creating application ${error}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};
