import { Document } from "mongoose";
import { Difficulty } from "./enums";

export interface IQuestion {
  question: string;
  options:  string[];
  answer:   string;
  difficulty?: Difficulty;
}

export interface IAssessment extends Document {
  jobId:           string;
  title:           string;
  questions:       IQuestion[];
  durationMinutes: number;
}
