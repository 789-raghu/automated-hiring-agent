import { Document } from "mongoose";

export type ApplicationStatus =
    | "applied"
    | "screening"
    | "shortlisted"
    | "interview"
    | "selected"
    | "rejected";

export interface IApplication extends Document {
    userId: string;
    jobId: string;
    status: ApplicationStatus;
    resumeScore?: number;
    aiMatchScore?: number;
    appliedAt: Date;
}
