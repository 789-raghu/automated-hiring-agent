import mongoose, { Schema } from "mongoose";
import { IInterview } from "../@types/interviews";

const InterviewSchema = new Schema<IInterview>(
    {
        applicationId: { type: String, required: true },
        scheduledAt: { type: Date, required: true },
        mode: { type: String, enum: ["online", "offline"], required: true },
        interviewer: { type: String, required: true },
        feedback: { type: String },
        rating: { type: Number, min: 1, max: 10 },
        status: {
            type: String,
            enum: ["scheduled", "completed", "missed"],
            default: "scheduled",
        },
    },
    { timestamps: true }
);

export const Interview = mongoose.model<IInterview>("Interview", InterviewSchema);
