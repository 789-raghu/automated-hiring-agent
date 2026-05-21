import { Document } from "mongoose";

export interface IJob extends Document {
    companyId: string;
    title: string;
    description: string;
    skillsRequired: string[];
    experienceLevel: "fresher" | "junior" | "mid" | "senior";
    salary?: {
        min: number;
        max: number;
    };
    location?: string;
    type: "full-time" | "part-time" | "internship" | "remote";
    screeningTest?: string;
    applicants: string[];
}