import { Response } from "express";
import logger from "../config/logger";
import { Assessment } from "../models/assessment_model";
import { User } from "../models/user_model";
import { Response as AssessmentResponse } from "../models/response_model";
import { Job } from "../models/job_models";
import {
  generateAssessment,
  type Question,
} from "../services/generate_questions.service";
import { ExperienceLevel, ResponseStatus } from "../@types/enums";
import type {
  AuthRequest,
  AssessmentByIdParams,
  GenerateAssessmentBody,
  SubmitAssessmentBody,
} from "../@types/request";
import type { ApiResponse } from "../@types/api_response";
import type { IAssessment } from "../@types/assessments";
import type { IQuestionResponse } from "../@types/responses";

const EXPERIENCE_YEARS: Record<ExperienceLevel, number> = {
  [ExperienceLevel.Fresher]: 0,
  [ExperienceLevel.Junior]: 1,
  [ExperienceLevel.Mid]: 3,
  [ExperienceLevel.Senior]: 6,
};

export const GetAssessmentById = async (
  req: AuthRequest & { params: AssessmentByIdParams },
  res: Response<ApiResponse<IAssessment>>,
) => {
  try {
    const { assessmentId } = req.params;

    const assessment =
      await Assessment.findById(assessmentId).select("-questions.answer");

    if (!assessment) {
      return res
        .status(404)
        .json({ success: false, message: "Assessment not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Assessment fetched successfully",
      data: assessment,
    });
  } catch (error) {
    logger.error(`Error fetching assessment: ${error}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const GenerateAssessment = async (
  req: AuthRequest & { body: GenerateAssessmentBody },
  res: Response<ApiResponse<IAssessment>>,
) => {
  try {
    const { jobId, totalQuestions = 10, durationMinutes = 30 } = req.body;

    if (!jobId) {
      return res
        .status(400)
        .json({ success: false, message: "jobId is required" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const experience = EXPERIENCE_YEARS[job.experienceLevel] ?? 1;

    const questions = await generateAssessment({
      role: job.title,
      experience,
      totalQuestions,
      jobDescription: job.description,
    });

    const assessment = new Assessment({
      jobId,
      title: `${job.title} Assessment`,
      durationMinutes,
      questions: questions.map((q: Question) => ({
        question: q.question,
        options: q.options.map((o) => o.text),
        answer: q.options.find((o) => o.id === q.correctAnswerId)?.text ?? "",
      })),
    });

    await assessment.save();
    logger.info(`Assessment generated for job ${jobId}`);

    return res.status(201).json({
      success: true,
      message: "Assessment generated successfully",
      data: assessment,
    });
  } catch (error) {
    logger.error(`Error generating assessment: ${error}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const AssessmentPreview = async (
  req: AuthRequest & { params: AssessmentByIdParams },
  res: Response<ApiResponse<IAssessment>>,
) => {
  try {
    const { assessmentId } = req.params;

    const assessment = await Assessment.findById(assessmentId);

    if (!assessment) {
      return res
        .status(404)
        .json({ success: false, message: "Assessment not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Assessment fetched successfully",
      data: assessment,
    });
  } catch (error) {
    logger.error(`Error fetching assessment: ${error}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const submitAssessment = async (
  req: AuthRequest & { body: SubmitAssessmentBody },
  res: Response<ApiResponse>,
) => {
  try {
    const { employeeId, assessmentId, responses } = req.body;

    if (!employeeId || !assessmentId || !responses) {
      return res.status(400).json({
        success: false,
        message: "employeeId, assessmentId and responses are required",
      });
    }

    const [assessment, employee] = await Promise.all([
      Assessment.findById(assessmentId),
      User.findById(employeeId),
    ]);

    if (!assessment || !employee) {
      return res
        .status(404)
        .json({ success: false, message: "Assessment or employee not found" });
    }

    const answerByIndex = new Map(
      assessment.questions.map((q, i) => [String(i), q.answer]),
    );

    const evaluatedResponses = responses.map((r: IQuestionResponse) => ({
      ...r,
      isCorrect: answerByIndex.get(r.questionId) === r.selectedAnswer,
    }));

    const score = evaluatedResponses.filter((r: IQuestionResponse & { isCorrect: boolean }) => r.isCorrect).length;

    const responseData = new AssessmentResponse({
      assessmentId,
      employeeId,
      responses: evaluatedResponses,
      score,
      totalQuestions: assessment.questions.length,
      submittedAt: new Date(),
      status: ResponseStatus.Submitted,
    });

    await responseData.save();
    logger.info(`Assessment submitted: ${score}/${assessment.questions.length} correct`);

    return res
      .status(200)
      .json({ success: true, message: "Assessment submitted successfully" });
  } catch (error) {
    logger.error(`Error submitting assessment: ${error}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
