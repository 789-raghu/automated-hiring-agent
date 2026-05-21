import { Document } from "mongoose";

export type Recommendation = "shortlist" | "hold" | "reject";

export interface IScreeningResult extends Document {
    applicationId: string;
    resumeSummary: string;
    extractedSkills: string[];
    matchScore: number;
    recommendation: Recommendation;
    reason: string;
    evaluatedAt: Date;
}
