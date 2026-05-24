export enum UserRole {
  Candidate = "candidate",
  Admin     = "admin",
}

export enum ExperienceLevel {
  Fresher = "fresher",
  Junior  = "junior",
  Mid     = "mid",
  Senior  = "senior",
}

export enum JobType {
  FullTime   = "full-time",
  PartTime   = "part-time",
  Internship = "internship",
  Remote     = "remote",
}

export enum ApplicationStatus {
  Applied     = "applied",
  Screening   = "screening",
  Shortlisted = "shortlisted",
  Interview   = "interview",
  Selected    = "selected",
  Rejected    = "rejected",
}

export enum InterviewRoundStatus {
  Pending = "pending",
  Passed  = "passed",
  Failed  = "failed",
}

export enum InterviewMode {
  Online  = "online",
  Offline = "offline",
}

export enum InterviewStatus {
  Scheduled = "scheduled",
  Completed = "completed",
  Missed    = "missed",
}

export enum ResponseStatus {
  InProgress = "in_progress",
  Submitted  = "submitted",
  Evaluated  = "evaluated",
}

export enum NotificationType {
  ApplicationUpdate = "application_update",
  Interview         = "interview",
  Result            = "result",
}

export enum Recommendation {
  Shortlist = "shortlist",
  Hold      = "hold",
  Reject    = "reject",
}

export enum Difficulty {
  Easy   = "easy",
  Medium = "medium",
  Hard   = "hard",
}

export enum Archetype {
  Debugging    = "Debugging",
  Scenario     = "Scenario",
  Architecture = "Architecture",
  Optimization = "Optimization",
  Conceptual   = "Conceptual",
}
