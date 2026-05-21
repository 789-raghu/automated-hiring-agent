import mongoose, { Schema } from "mongoose";
import { IApplication } from "../@types/applications";

const ApplicationSchema = new Schema<IApplication>(
    {
        userId: { type: String, required: true },
        jobId: { type: String, required: true },
        status: {
            type: String,
            enum: ["applied", "screening", "shortlisted", "interview", "selected", "rejected"],
            default: "applied",
        },
        resumeScore: { type: Number },
        aiMatchScore: { type: Number },
        appliedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export const Application = mongoose.model<IApplication>("Application", ApplicationSchema);
