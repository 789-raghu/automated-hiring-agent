import { Document } from "mongoose";
import { ApplicationStatus, InterviewRoundStatus } from "./enums";

export interface IEducation {
  college:    string;
  degree:     string;
  branch:     string;
  cgpa?:      number;
  startYear?: number;
  endYear?:   number;
}

export interface IExperience {
  company:      string;
  role:         string;
  years?:       number;
  description?: string;
}

export interface IInterviewRound {
  roundName: string;
  score?:    number;
  feedback?: string;
  status:    InterviewRoundStatus;
}

export interface IAIAnalysis {
  strengths?: string[];
  weaknesses?: string[];
  summary?:   string;
}

export interface IApplication extends Document {
  userId:    string;
  jobId:     string;
  companyId: string;

  status: ApplicationStatus;

  skills?: string[];

  education?: IEducation[];

  experience?: IExperience[];

  resumeScore?:   number;
  aiMatchScore?:  number;
  aiAnalysis?:    IAIAnalysis;

  interviewRounds?: IInterviewRound[];

  appliedOn:  Date;
  createdAt:  Date;
  updatedAt:  Date;
}
