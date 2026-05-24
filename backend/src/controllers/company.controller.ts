import { Response } from "express";
import { Company } from "../models/company_model";
import logger from "../config/logger";
import { parsePagination, buildMeta } from "../utils/pagination";
import type { AuthRequest, GetCompaniesQuery } from "../@types/request";
import type { ApiResponse, PaginatedResponse } from "../@types/api_response";
import type { ICompany } from "../@types/companies";

export const getCompanyById = async (
  req: AuthRequest & { params: { id: string } },
  res: Response<ApiResponse<ICompany>>,
) => {
  try {
    const { id } = req.params;

    const company = await Company.findById(id).select("-password");

    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }

    logger.info(`Company fetched: ${id}`);
    return res.status(200).json({
      success: true,
      message: "Company fetched successfully",
      data: company,
    });
  } catch (error) {
    logger.error(`Error fetching company: ${error}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getComapanies = async (
  req: AuthRequest & { query: GetCompaniesQuery },
  res: Response<PaginatedResponse<ICompany>>,
) => {
  try {
    const { industry, location, page, limit } = req.query;

    const filter: Record<string, any> = {};
    if (industry) filter.industry = { $regex: industry, $options: "i" };
    if (location) filter.location = { $regex: location, $options: "i" };

    const pg = parsePagination(page, limit);

    const [companies, total] = await Promise.all([
      Company.find(filter)
        .select("-password")
        .skip(pg.skip)
        .limit(pg.limit)
        .sort({ createdAt: -1 }),
      Company.countDocuments(filter),
    ]);

    logger.info("Companies fetched successfully");
    return res.status(200).json({
      success: true,
      message: "Companies fetched successfully",
      data: companies,
      pagination: buildMeta(total, pg),
    });
  } catch (error) {
    logger.error(`Error fetching companies: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: [],
      pagination: { total: 0, page: 1, limit: 10, pages: 0 },
    });
  }
};

export const createCompany = async (
  req: AuthRequest,
  res: Response<ApiResponse<ICompany>>,
) => {
  try {
    const {
      companyName,
      industry,
      email,
      password,
      description,
      website,
      location,
    } = req.body;

    if (!companyName || !industry || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "companyName, industry, email and password are required",
      });
    }

    const existing = await Company.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Company with this email already exists",
      });
    }

    const company = new Company({
      companyName,
      industry,
      email,
      password,
      description,
      website,
      location,
    });
    await company.save();

    logger.info(`Company created: ${company._id}`);
    return res.status(201).json({
      success: true,
      message: "Company created successfully",
      data: company,
    });
  } catch (error) {
    logger.error(`Error creating company: ${error}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const updateCompany = async (
  req: AuthRequest & { params: { id: string } },
  res: Response<ApiResponse<ICompany>>,
) => {
  try {
    const { id } = req.params;

    const allowedFields = [
      "companyName",
      "industry",
      "description",
      "website",
      "location",
    ];
    const updateFields: Record<string, any> = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updateFields[field] = req.body[field];
    }

    const updated = await Company.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true },
    ).select("-password");

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }

    logger.info(`Company updated: ${id}`);
    return res.status(200).json({
      success: true,
      message: "Company updated successfully",
      data: updated,
    });
  } catch (error) {
    logger.error(`Error updating company: ${error}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const deleteCompany = async (
  req: AuthRequest & { params: { id: string } },
  res: Response<ApiResponse>,
) => {
  try {
    const { id } = req.params;

    const company = await Company.findByIdAndDelete(id);

    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }

    logger.info(`Company deleted: ${id}`);
    return res
      .status(200)
      .json({ success: true, message: "Company deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting company: ${error}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
