import { Document } from "mongoose";

export interface IInterview extends Document {
    applicationId: string;
    scheduledAt: Date;
    mode: "online" | "offline";
    interviewer: string;
    feedback?: string;
    rating?: number;
    status: "scheduled" | "completed" | "missed";
}