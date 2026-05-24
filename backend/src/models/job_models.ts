import mongoose, { Schema } from "mongoose";
import { IJob } from "../@types/jobs";
import { ExperienceLevel, JobType } from "../@types/enums";

const JobSchema = new Schema<IJob>(
  {
    companyId: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    skillsRequired: { type: [String], default: [] },
    experienceLevel: {
      type: String,
      enum: Object.values(ExperienceLevel),
      required: true,
    },
    salary: {
      min: { type: Number },
      max: { type: Number },
    },
    location: { type: String },
    type: {
      type: String,
      enum: Object.values(JobType),
      required: true,
    },
    screeningTest: { type: String },
    applicants: { type: [String], default: [] },
  },
  { timestamps: true },
);

export const Job = mongoose.model<IJob>("Job", JobSchema);
