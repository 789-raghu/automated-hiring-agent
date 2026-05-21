import { Document } from "mongoose";

export interface IAssessment extends Document {
    jobId: string;

    title: string;

    questions: {
        question: string;
        options?: string[];
        answer: string;
    }[];

    durationMinutes: number;
}
