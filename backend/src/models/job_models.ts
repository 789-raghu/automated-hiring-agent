import mongoose, { Schema } from "mongoose";
import { IJob } from "../@types/jobs";

const JobSchema = new Schema<IJob>(
    {
        companyId: { type: String, required: true },
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        skillsRequired: { type: [String], default: [] },
        experienceLevel: {
            type: String,
            enum: ["fresher", "junior", "mid", "senior"],
            required: true,
        },
        salary: {
            min: { type: Number },
            max: { type: Number },
        },
        location: { type: String },
        type: {
            type: String,
            enum: ["full-time", "part-time", "internship", "remote"],
            required: true,
        },
        screeningTest: { type: String },
        applicants: { type: [String], default: [] },
    },
    { timestamps: true }
);

export const Job = mongoose.model<IJob>("Job", JobSchema);
