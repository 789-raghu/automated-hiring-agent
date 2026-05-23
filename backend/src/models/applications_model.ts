import mongoose, { Schema } from "mongoose";
import { IApplication } from "../@types/applications";

const EducationSchema = new Schema(
  {
    college: { type: String, required: true },

    degree: { type: String, required: true },

    branch: { type: String, required: true },

    cgpa: { type: Number },

    startYear: { type: Number },

    endYear: { type: Number },
  },
  { _id: false },
);

const ExperienceSchema = new Schema(
  {
    company: { type: String, required: true },

    role: { type: String, required: true },

    years: { type: Number },

    description: { type: String },
  },
  { _id: false },
);

const InterviewRoundSchema = new Schema(
  {
    roundName: { type: String, required: true },

    score: { type: Number },

    feedback: { type: String },

    status: {
      type: String,
      enum: ["pending", "passed", "failed"],
      default: "pending",
    },
  },
  { _id: false },
);

const AIAnalysisSchema = new Schema(
  {
    strengths: [{ type: String }],

    weaknesses: [{ type: String }],

    summary: { type: String },
  },
  { _id: false },
);

const ApplicationSchema = new Schema<IApplication>(
  {
    userId: {
      type: String,
      required: true,
    },

    jobId: {
      type: String,
      required: true,
    },

    companyId: {
      type: String,
      required: true,
    },

    status: {
      type: String,

      enum: [
        "applied",
        "screening",
        "shortlisted",
        "interview",
        "selected",
        "rejected",
      ],

      default: "applied",
    },

    skills: [String],

    education: [EducationSchema],

    experience: [ExperienceSchema],

    resumeScore: {
      type: Number,
    },

    aiMatchScore: {
      type: Number,
    },

    aiAnalysis: AIAnalysisSchema,
    interviewRounds: [InterviewRoundSchema],
    appliedOn: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

export const Application = mongoose.model<IApplication>(
  "Application",
  ApplicationSchema,
);
