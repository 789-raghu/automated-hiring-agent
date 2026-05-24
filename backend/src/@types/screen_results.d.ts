import { Document } from "mongoose";
import { Recommendation } from "./enums";

export interface IScreeningResult extends Document {
  applicationId:   string;
  resumeSummary:   string;
  extractedSkills: string[];
  matchScore:      number;
  recommendation:  Recommendation;
  reason:          string;
  evaluatedAt:     Date;
}
