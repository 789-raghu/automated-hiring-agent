import mongoose, { Schema } from "mongoose";
import { IScreeningResult } from "../@types/screen_results";

const ScreeningResultSchema = new Schema<IScreeningResult>(
    {
        applicationId: { type: String, required: true },
        resumeSummary: { type: String, required: true },
        extractedSkills: { type: [String], default: [] },
        matchScore: { type: Number, required: true },
        recommendation: {
            type: String,
            enum: ["shortlist", "hold", "reject"],
            required: true,
        },
        reason: { type: String, required: true },
        evaluatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export const ScreeningResult = mongoose.model<IScreeningResult>(
    "ScreeningResult",
    ScreeningResultSchema
);
