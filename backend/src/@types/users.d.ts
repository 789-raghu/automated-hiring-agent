import { Document } from "mongoose";

export interface IUser extends Document {
    fullName: string;
    email: string;
    password: string;
    role: "candidate" | "admin";
    resume?: string;
    skills: string[];
    experienceYears: number;
    appliedJobs: string[];
    createdAt: Date;
}
