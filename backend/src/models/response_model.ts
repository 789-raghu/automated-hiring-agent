import mongoose, { Schema } from "mongoose";
import { IResponse } from "../@types/responses";
import { ResponseStatus } from "../@types/enums";

const QuestionResponseSchema = new Schema(
  {
    questionId: {
      type: String,
      required: true,
    },
    selectedAnswer: {
      type: String,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      default: undefined,
    },
  },
  { _id: false },
);

const ResponseSchema = new Schema<IResponse>(
  {
    assessmentId: {
      type: String,
      required: true,
    },

    employeeId: {
      type: String,
      required: true,
    },

    responses: {
      type: [QuestionResponseSchema],
      required: true,
      default: [],
    },

    score: {
      type: Number,
      default: 0,
    },

    totalQuestions: {
      type: Number,
      required: true,
    },

    submittedAt: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: Object.values(ResponseStatus),
      required: true,
      default: ResponseStatus.InProgress,
    },
  },
  {
    timestamps: true,
  },
);

export const Response = mongoose.model<IResponse>("Response", ResponseSchema);
