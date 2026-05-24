import { Document } from "mongoose";
import { ExperienceLevel, JobType } from "./enums";

export interface IJob extends Document {
  companyId:       string;
  title:           string;
  description:     string;
  skillsRequired:  string[];
  experienceLevel: ExperienceLevel;
  salary?: {
    min: number;
    max: number;
  };
  location?:    string;
  type:         JobType;
  screeningTest?: string;
  applicants:   string[];
}
