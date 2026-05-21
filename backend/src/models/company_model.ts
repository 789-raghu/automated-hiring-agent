import mongoose, { Schema } from "mongoose";
import { ICompany } from "../@types/companies";

const CompanySchema = new Schema<ICompany>(
    {
        companyName: { type: String, required: true, trim: true },
        industry: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true },
        description: { type: String },
        website: { type: String },
        location: { type: String },
        jobsPosted: { type: [String], default: [] },
    },
    { timestamps: true }
);

export const Company = mongoose.model<ICompany>("Company", CompanySchema);
