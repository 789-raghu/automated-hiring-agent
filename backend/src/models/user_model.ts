import mongoose, { Schema } from "mongoose";
import { IUser } from "../@types/users";

const UserSchema = new Schema<IUser>(
    {
        fullName: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["candidate", "admin"], default: "candidate" },
        resume: { type: String },
        skills: { type: [String], default: [] },
        experienceYears: { type: Number, default: 0 },
        appliedJobs: { type: [String], default: [] },
    },
    { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
