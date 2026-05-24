import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { IQuestionResponse } from "./responses";
import { ExperienceLevel, JobType, ApplicationStatus, UserRole } from "./enums";

// ── Shared pagination ─────────────────────────────────────────────────────────

export interface PaginationQuery {
  page?:  string;
  limit?: string;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

// ── Assessment ────────────────────────────────────────────────────────────────

export interface GenerateAssessmentBody {
  jobId:            string;
  totalQuestions?:  number;
  durationMinutes?: number;
}

export interface SubmitAssessmentBody {
  employeeId:   string;
  assessmentId: string;
  responses:    IQuestionResponse[];
}

export interface AssessmentByIdParams {
  assessmentId: string;
}

// ── Job ───────────────────────────────────────────────────────────────────────

export interface CreateJobBody {
  companyId:       string;
  title:           string;
  description:     string;
  skillsRequired?: string[];
  experienceLevel: ExperienceLevel;
  salary?:         { min: number; max: number };
  location?:       string;
  type:            JobType;
}

export interface UpdateJobBody {
  title?:           string;
  description?:     string;
  skillsRequired?:  string[];
  experienceLevel?: ExperienceLevel;
  salary?:          { min: number; max: number };
  location?:        string;
  type?:            JobType;
  screeningTest?:   string;
}

export interface JobByIdParams {
  jobId: string;
}

export interface GetAllJobsQuery extends PaginationQuery {
  companyId?:       string;
  experienceLevel?: ExperienceLevel;
  type?:            JobType;
  location?:        string;
}

// ── Application ───────────────────────────────────────────────────────────────

export interface GetApplicationsQuery extends PaginationQuery {
  status?: ApplicationStatus;
}

// ── Company ───────────────────────────────────────────────────────────────────

export interface GetCompaniesQuery extends PaginationQuery {
  industry?: string;
  location?: string;
}

// ── User ──────────────────────────────────────────────────────────────────────

export interface GetUsersQuery extends PaginationQuery {
  role?: UserRole;
}

// ── Application ───────────────────────────────────────────────────────────────

export interface CreateApplicationBody {
  userId:    string;
  jobId:     string;
  companyId: string;
}

export interface ApplicationByIdParams {
  applicationId: string;
}

// ── Auth (login / register) ───────────────────────────────────────────────────

export interface RegisterBody {
  fullName: string;
  email:    string;
  password: string;
  role?:    string;
}

export interface LoginBody {
  email:    string;
  password: string;
}
