import { Request, Response } from "express";
import { Company } from "../models/company_model";
import logger from "../config/logger";

export const getCompanyById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (id == undefined) {
      logger.error(`the id is undefined : ${id}`);
      return res.status(500).json({
        success: false,
        message: "Id is require",
      });
    }

    const company = await Company.findOne({ _id: id });

    if (company == undefined) {
      logger.error(`company not found for the given id : ${id}`);
      return res.status(404).json({
        success: false,
        message: "No company with given Id",
      });
    }
    logger.info("Company fetched successfully");
    return res.status(200).json({
      success: true,
      message: "Company fetched successfully",
      data: company,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

export const getComapanies = async (req: Request, res: Response) => {
  try {
    const companies = await Company.find();
    logger.info("Companies fetched successfully");
    return res.status(200).json({
      success: true,
      message: "Companies fetched successfully",
      data: companies,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

export const createCompany = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (data == undefined) {
      logger.error(`Fill all the required fields : ${data}`);
      return res.status(500).json({
        status: false,
        message: "Fill all the required fields",
      });
    }

    const company = new Company({ ...data });
    await company.save();
    logger.info("Company created successfully");
    return res.status(200).json({
      status: true,
      message: "Company created successfully",
    });
  } catch (error) {}
};

export const updateCompany = async (req: Request, res: Response) => {
  try {
    const id = req.query.id as string;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Company id is required",
      });
    }

    const allowedFields = [
      "companyName",
      "industry",
      "description",
      "website",
      "location",
    ];

    const updateFields: Record<string, any> = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    const updatedCompany = await Company.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedCompany) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    logger.info(`Company updated successfully: ${id}`);

    return res.status(200).json({
      success: true,
      message: "Company updated successfully",
      company: updatedCompany,
    });
  } catch (error) {
    logger.error(`Error updating company: ${error}`);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteCompany = async (req: Request, res: Response) => {
  try {
    const id = req.query.id as string;

    if (id == undefined) {
      logger.error(`the id is undefined : ${id}`);
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }

    const company = await Company.deleteOne({ _id: id });

    if (company.deletedCount == 0) {
      logger.error(`company not found for the given id : ${id}`);
      return res.status(404).json({
        success: false,
        message: "No company with given Id",
      });
    }
    logger.info("Company deleted successfully");
    return res.status(200).json({
      success: true,
      message: "Company deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};
