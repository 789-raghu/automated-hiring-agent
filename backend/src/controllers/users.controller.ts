import { Response } from "express";
import { User } from "../models/user_model";
import bcrypt from "bcrypt";
import logger from "../config/logger";
import { parsePagination, buildMeta } from "../utils/pagination";
import type { AuthRequest, GetUsersQuery } from "../@types/request";
import type { ApiResponse, PaginatedResponse } from "../@types/api_response";
import type { IUser } from "../@types/users";

export const createUser = async (
  req: AuthRequest,
  res: Response<ApiResponse<{ id: unknown; email: string }>>,
) => {
  try {
    const { email, password, fullName, role, skills, experienceYears } =
      req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: "fullName, email and password are required",
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      role,
      skills,
      experienceYears,
    });
    await user.save();

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { id: user._id, email: user.email },
    });
  } catch (error) {
    logger.error(`Error creating user: ${error}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const updateProfile = async (
  req: AuthRequest & { params: { id: string } },
  res: Response<ApiResponse<IUser>>,
) => {
  try {
    const { id } = req.params;

    const allowedFields = ["fullName", "skills", "resume", "experienceYears"];
    const updates: Record<string, any> = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const updated = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true },
    ).select("-password");

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    logger.info(`Profile updated: ${id}`);
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updated,
    });
  } catch (error) {
    logger.error(`Error updating profile: ${error}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getUsers = async (
  req: AuthRequest & { query: GetUsersQuery },
  res: Response<PaginatedResponse<IUser>>,
) => {
  try {
    const { role, page, limit } = req.query;

    const filter: Record<string, any> = {};
    if (role) filter.role = role;

    const pg = parsePagination(page, limit);

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .skip(pg.skip)
        .limit(pg.limit)
        .sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);

    logger.info("Users fetched successfully");
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
      pagination: buildMeta(total, pg),
    });
  } catch (error) {
    logger.error(`Error fetching users: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: [],
      pagination: { total: 0, page: 1, limit: 10, pages: 0 },
    });
  }
};

export const getUserById = async (
  req: AuthRequest & { params: { id: string } },
  res: Response<ApiResponse<IUser>>,
) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    logger.error(`Error fetching user: ${error}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const deleteUser = async (
  req: AuthRequest & { params: { id: string } },
  res: Response<ApiResponse>,
) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    logger.info(`User deleted: ${id}`);
    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting user: ${error}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
