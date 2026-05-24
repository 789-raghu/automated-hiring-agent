import { Document } from "mongoose";
import { ResponseStatus } from "./enums";

export interface IQuestionResponse {
  questionId:      string;
  selectedAnswer:  string;
  isCorrect?:      boolean;
}

export interface IResponse extends Document {
  assessmentId:   string;
  employeeId:     string;
  responses:      IQuestionResponse[];
  score?:         number;
  totalQuestions: number;
  submittedAt?:   Date;
  status:         ResponseStatus;
}
