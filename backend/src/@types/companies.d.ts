import { Document } from "mongoose";

export interface ICompany extends Document {
    companyName: string;
    industry: string;
    email: string;
    password: string;
    description?: string;
    website?: string;
    location?: string;
    jobsPosted: string[];
}