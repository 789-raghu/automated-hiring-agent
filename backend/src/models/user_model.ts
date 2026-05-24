import mongoose, { Schema } from "mongoose";
import { IUser } from "../@types/users";
import { Job } from "./job_models";
import { UserRole } from "../@types/enums";

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.Candidate,
    },
    resume: { type: String },
    skills: { type: [String], default: [] },
    experienceYears: { type: Number, default: 0 },
    applications: [
      {
        type: Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>("User", UserSchema);
