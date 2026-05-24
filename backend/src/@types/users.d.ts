import { Document } from "mongoose";
import { UserRole } from "./enums";

export interface IUser extends Document {
  fullName:        string;
  email:           string;
  password:        string;
  role:            UserRole;
  resume?:         string;
  skills:          string[];
  experienceYears: number;
  applications:    string[];
  createdAt:       Date;
}
