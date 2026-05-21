import mongoose, { Schema } from "mongoose";
import { IAssessment } from "../@types/assessments";

const QuestionSchema = new Schema(
    {
        question: { type: String, required: true },
        options: { type: [String] },
        answer: { type: String, required: true },
    },
    { _id: false }
);

const AssessmentSchema = new Schema<IAssessment>(
    {
        jobId: { type: String, required: true },
        title: { type: String, required: true, trim: true },
        questions: { type: [QuestionSchema], default: [] },
        durationMinutes: { type: Number, required: true },
    },
    { timestamps: true }
);

export const Assessment = mongoose.model<IAssessment>("Assessment", AssessmentSchema);
