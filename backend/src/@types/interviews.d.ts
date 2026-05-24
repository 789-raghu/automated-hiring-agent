import { Document } from "mongoose";
import { InterviewMode, InterviewStatus } from "./enums";

export interface IInterview extends Document {
  applicationId: string;
  scheduledAt:   Date;
  mode:          InterviewMode;
  interviewer:   string;
  feedback?:     string;
  rating?:       number;
  status:        InterviewStatus;
}
